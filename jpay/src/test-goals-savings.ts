// Goals and Savings Logs API 테스트 스크립트
import { 
  supabase,
  createPair, 
  createGoal, 
  getGoals, 
  updateGoal, 
  deleteGoal,
  createSavingsLog,
  getSavingsLogs,
  updateSavingsLog,
  deleteSavingsLog,
  getTotalSavingsForGoal,
  subscribeToGoals,
  subscribeToSavingsLogs
} from './lib/supabase'

async function testGoalsAndSavingsAPI() {
  console.log('🚀 Goals and Savings API 테스트 시작')
  
  try {
    // 1. 테스트용 페어 생성
    console.log('\n1. 테스트용 페어 생성...')
    const pair = await createPair('테스트 페어')
    console.log('✅ 페어 생성 성공:', pair.id)
    
    // 2. 목표 생성 테스트
    console.log('\n2. 목표 생성 테스트...')
    const goal1 = await createGoal({
      pair_id: pair.id,
      name: '제주도 여행',
      target_amount: 1000000,
      deadline: '2024-12-31',
      icon_url: '🏝️',
      is_completed: false,
      completed_at: null
    })
    console.log('✅ 목표 1 생성 성공:', goal1.name)
    
    const goal2 = await createGoal({
      pair_id: pair.id,
      name: '노트북 구매',
      target_amount: 2000000,
      deadline: '2024-06-30',
      icon_url: '💻',
      is_completed: false,
      completed_at: null
    })
    console.log('✅ 목표 2 생성 성공:', goal2.name)
    
    // 3. 목표 조회 테스트
    console.log('\n3. 목표 조회 테스트...')
    const goals = await getGoals(pair.id)
    console.log('✅ 목표 조회 성공:', goals.length, '개')
    goals.forEach(goal => {
      console.log(`   - ${goal.name}: ${goal.target_amount.toLocaleString()}원 (마감: ${goal.deadline})`)
    })
    
    // 4. 저축 로그 생성 테스트
    console.log('\n4. 저축 로그 생성 테스트...')
    const savingsLog1 = await createSavingsLog({
      goal_id: goal1.id,
      amount: 150000,
      date: '2024-01-15',
      memo: '용돈 저축'
    })
    console.log('✅ 저축 로그 1 생성 성공:', savingsLog1.amount.toLocaleString() + '원')
    
    const savingsLog2 = await createSavingsLog({
      goal_id: goal1.id,
      amount: 200000,
      date: '2024-02-01',
      memo: '보너스 일부'
    })
    console.log('✅ 저축 로그 2 생성 성공:', savingsLog2.amount.toLocaleString() + '원')
    
    const savingsLog3 = await createSavingsLog({
      goal_id: goal2.id,
      amount: 300000,
      date: '2024-01-20',
      memo: '노트북 펀드 시작'
    })
    console.log('✅ 저축 로그 3 생성 성공:', savingsLog3.amount.toLocaleString() + '원')
    
    // 5. 저축 로그 조회 테스트
    console.log('\n5. 저축 로그 조회 테스트...')
    const goal1Logs = await getSavingsLogs(goal1.id)
    console.log('✅ 제주도 여행 저축 내역:', goal1Logs.length, '개')
    goal1Logs.forEach(log => {
      console.log(`   - ${log.date}: ${log.amount.toLocaleString()}원 (${log.memo})`)
    })
    
    const goal2Logs = await getSavingsLogs(goal2.id)
    console.log('✅ 노트북 구매 저축 내역:', goal2Logs.length, '개')
    goal2Logs.forEach(log => {
      console.log(`   - ${log.date}: ${log.amount.toLocaleString()}원 (${log.memo})`)
    })
    
    // 6. 총 저축액 조회 테스트
    console.log('\n6. 총 저축액 조회 테스트...')
    const goal1Total = await getTotalSavingsForGoal(goal1.id)
    const goal2Total = await getTotalSavingsForGoal(goal2.id)
    console.log('✅ 제주도 여행 총 저축액:', goal1Total.toLocaleString() + '원')
    console.log('✅ 노트북 구매 총 저축액:', goal2Total.toLocaleString() + '원')
    
    // 7. 목표 수정 테스트
    console.log('\n7. 목표 수정 테스트...')
    const updatedGoal = await updateGoal(goal1.id, {
      target_amount: 1200000,
      deadline: '2024-11-30'
    })
    console.log('✅ 목표 수정 성공:', updatedGoal.name, '->', updatedGoal.target_amount.toLocaleString() + '원')
    
    // 8. 저축 로그 수정 테스트
    console.log('\n8. 저축 로그 수정 테스트...')
    const updatedLog = await updateSavingsLog(savingsLog1.id, {
      amount: 180000,
      memo: '용돈 저축 (수정됨)'
    })
    console.log('✅ 저축 로그 수정 성공:', updatedLog.amount.toLocaleString() + '원')
    
    // 9. Realtime 구독 테스트 (3초간 테스트)
    console.log('\n9. Realtime 구독 테스트 (3초간)...')
    const goalsSubscription = subscribeToGoals(pair.id, (payload) => {
      console.log('🔔 목표 변경 감지:', payload.eventType, payload.new || payload.old)
    })
    
    const savingsSubscription = subscribeToSavingsLogs(goal1.id, (payload) => {
      console.log('🔔 저축 로그 변경 감지:', payload.eventType, payload.new || payload.old)
    })
    
    // 3초 후 구독 해제
    setTimeout(() => {
      supabase.removeChannel(goalsSubscription)
      supabase.removeChannel(savingsSubscription)
      console.log('✅ Realtime 구독 테스트 완료')
    }, 3000)
    
    // 10. 데이터 정리 (선택적)
    console.log('\n10. 테스트 데이터 정리...')
    await deleteSavingsLog(savingsLog1.id)
    await deleteSavingsLog(savingsLog2.id)
    await deleteSavingsLog(savingsLog3.id)
    console.log('✅ 저축 로그 삭제 완료')
    
    await deleteGoal(goal1.id)
    await deleteGoal(goal2.id)
    console.log('✅ 목표 삭제 완료')
    
    console.log('\n🎉 모든 테스트 완료!')
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error)
  }
}

// 브라우저 환경에서 실행
if (typeof window !== 'undefined') {
  (window as any).testGoalsAndSavingsAPI = testGoalsAndSavingsAPI
  console.log('콘솔에서 testGoalsAndSavingsAPI() 를 실행해보세요.')
}

export { testGoalsAndSavingsAPI }