// Supabase CRUD 함수 테스트 스크립트
// 개발 환경에서 수동 실행용

import { 
  createPair, 
  joinPair, 
  getExpenses, 
  addExpense, 
  getBudget, 
  setBudget,
  getAnonymousUserId,
  clearAnonymousUserId 
} from './lib/supabase'

// 테스트 데이터
const testPairName = '테스트 커플'
const testExpense = {
  pair_id: '', // 생성된 페어 ID로 설정됨
  amount: 15000,
  title: '점심식사',
  description: '파스타 맛집에서 식사',
  expense_date: new Date().toISOString().split('T')[0],
  paid_by: '', // 익명 사용자 ID로 설정됨
  split_ratio: 0.5,
  category: '식비',
  memo: '정말 맛있었어요!',
  receipt_url: null,
  is_settled: false,
  settled_at: null
}

async function runTests() {
  console.log('🧪 Supabase CRUD 테스트 시작\n')
  
  try {
    // 1. 익명 사용자 ID 확인
    console.log('1️⃣ 익명 사용자 ID 생성/확인')
    const userId = getAnonymousUserId()
    console.log(`   사용자 ID: ${userId}`)
    
    // 2. 페어 생성
    console.log('\n2️⃣ 페어 생성 테스트')
    const pair = await createPair(testPairName)
    console.log(`   생성된 페어 ID: ${pair.id}`)
    console.log(`   초대 코드: ${pair.invite_code}`)
    console.log(`   페어 이름: ${pair.pair_name}`)
    
    // 3. 지출 추가
    console.log('\n3️⃣ 지출 추가 테스트')
    testExpense.pair_id = pair.id
    testExpense.paid_by = userId
    
    const expense = await addExpense(testExpense)
    console.log(`   추가된 지출 ID: ${expense.id}`)
    console.log(`   지출 내용: ${expense.title} - ${expense.amount}원`)
    
    // 4. 지출 조회
    console.log('\n4️⃣ 지출 조회 테스트')
    const expenses = await getExpenses(pair.id)
    console.log(`   조회된 지출 개수: ${expenses.length}`)
    expenses.forEach((exp, index) => {
      console.log(`   ${index + 1}. ${exp.title}: ${exp.amount}원 (${exp.category})`)
    })
    
    // 5. 예산 설정
    console.log('\n5️⃣ 예산 설정 테스트')
    const currentDate = new Date()
    const budget = await setBudget({
      pair_id: pair.id,
      budget_year: currentDate.getFullYear(),
      budget_month: currentDate.getMonth() + 1,
      total_budget: 500000,
      category_budgets: {
        '식비': 200000,
        '교통비': 100000,
        '쇼핑': 150000,
        '기타': 50000
      },
      alert_threshold: 0.8
    })
    console.log(`   예산 ID: ${budget.id}`)
    console.log(`   총 예산: ${budget.total_budget}원`)
    
    // 6. 예산 조회
    console.log('\n6️⃣ 예산 조회 테스트')
    const retrievedBudget = await getBudget(
      pair.id, 
      currentDate.getFullYear(), 
      currentDate.getMonth() + 1
    )
    if (retrievedBudget) {
      console.log(`   조회된 예산: ${retrievedBudget.total_budget}원`)
      console.log(`   카테고리별 예산:`, retrievedBudget.category_budgets)
    }
    
    // 7. 두 번째 사용자로 페어 참여 테스트 (시뮬레이션)
    console.log('\n7️⃣ 페어 참여 테스트 (두 번째 사용자 시뮬레이션)')
    
    // 기존 익명 ID 저장
    const originalUserId = userId
    
    // 새로운 익명 ID 생성
    clearAnonymousUserId()
    const secondUserId = getAnonymousUserId()
    console.log(`   두 번째 사용자 ID: ${secondUserId}`)
    
    try {
      const joinedPair = await joinPair(pair.invite_code)
      console.log(`   페어 참여 성공: ${joinedPair.pair_name}`)
      console.log(`   User1: ${joinedPair.user1_id}`)
      console.log(`   User2: ${joinedPair.user2_id}`)
    } catch (error) {
      console.log(`   페어 참여 테스트 실패: ${error}`)
    }
    
    // 원래 사용자 ID 복원
    localStorage.setItem('jpay_anonymous_user_id', originalUserId)
    
    console.log('\n✅ 모든 테스트 완료!')
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error)
  }
}

// 브라우저 콘솔에서 실행할 수 있도록 window 객체에 등록
if (typeof window !== 'undefined') {
  (window as any).runSupabaseTests = runTests
}

export { runTests }