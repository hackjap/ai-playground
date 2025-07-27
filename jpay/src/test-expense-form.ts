// ExpenseForm 테스트 유틸리티
// 브라우저 콘솔에서 실행하여 폼 유효성 검증 테스트

interface TestFormData {
  amount: string
  title: string
  category: string
  expenseDate: string
}

// 테스트 케이스들
const testCases = [
  {
    name: '정상적인 폼 데이터',
    data: {
      amount: '15000',
      title: '스타벅스 커피',
      category: 'food',
      expenseDate: '2025-01-27'
    },
    expectedValid: true
  },
  {
    name: '금액이 없는 경우',
    data: {
      amount: '',
      title: '스타벅스 커피',
      category: 'food',
      expenseDate: '2025-01-27'
    },
    expectedValid: false
  },
  {
    name: '금액이 0인 경우',
    data: {
      amount: '0',
      title: '스타벅스 커피',
      category: 'food',
      expenseDate: '2025-01-27'
    },
    expectedValid: false
  },
  {
    name: '제목이 없는 경우',
    data: {
      amount: '15000',
      title: '',
      category: 'food',
      expenseDate: '2025-01-27'
    },
    expectedValid: false
  },
  {
    name: '카테고리가 없는 경우',
    data: {
      amount: '15000',
      title: '스타벅스 커피',
      category: '',
      expenseDate: '2025-01-27'
    },
    expectedValid: false
  },
  {
    name: '날짜가 없는 경우',
    data: {
      amount: '15000',
      title: '스타벅스 커피',
      category: 'food',
      expenseDate: ''
    },
    expectedValid: false
  }
]

// 유효성 검증 함수 (ExpenseForm과 동일한 로직)
function validateFormData(data: TestFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.push('금액을 올바르게 입력해주세요')
  }

  if (!data.title.trim()) {
    errors.push('지출 내용을 입력해주세요')
  }

  if (!data.category) {
    errors.push('카테고리를 선택해주세요')
  }

  if (!data.expenseDate) {
    errors.push('날짜를 선택해주세요')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// 분담 비율 계산 테스트
function testSplitCalculations() {
  console.log('🧮 분담 비율 계산 테스트')
  
  const amount = 10000
  const splitRatios = [0.0, 0.5, 1.0]
  
  splitRatios.forEach(ratio => {
    const myShare = amount * ratio
    const partnerShare = amount * (1 - ratio)
    
    console.log(`💰 총액: ${amount.toLocaleString()}원, 분담비율: ${ratio * 100}%`)
    console.log(`   내가 부담: ${myShare.toLocaleString()}원`)
    console.log(`   상대방 부담: ${partnerShare.toLocaleString()}원`)
    console.log(`   합계 검증: ${myShare + partnerShare === amount ? '✅' : '❌'}`)
    console.log('')
  })
}

// 메인 테스트 실행 함수
function runExpenseFormTests() {
  console.log('🧪 ExpenseForm 유효성 검증 테스트 시작\n')
  
  let passedTests = 0
  let totalTests = testCases.length
  
  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}️⃣ ${testCase.name}`)
    
    const result = validateFormData(testCase.data)
    const passed = result.isValid === testCase.expectedValid
    
    if (passed) {
      console.log('   ✅ 통과')
      passedTests++
    } else {
      console.log('   ❌ 실패')
      console.log(`   예상: ${testCase.expectedValid ? '유효함' : '유효하지 않음'}`)
      console.log(`   실제: ${result.isValid ? '유효함' : '유효하지 않음'}`)
      if (result.errors.length > 0) {
        console.log(`   오류: ${result.errors.join(', ')}`)
      }
    }
    console.log('')
  })
  
  console.log(`📊 테스트 결과: ${passedTests}/${totalTests} 통과`)
  
  // 분담 비율 계산 테스트 실행
  testSplitCalculations()
  
  return passedTests === totalTests
}

// 카테고리 매핑 테스트
function testCategoryMapping() {
  console.log('🏷️ 카테고리 매핑 테스트')
  
  const categories = [
    { value: 'food', label: '외식', emoji: '🍽️' },
    { value: 'transport', label: '교통', emoji: '🚗' },
    { value: 'shopping', label: '쇼핑', emoji: '🛍️' },
    { value: 'utilities', label: '생활용품', emoji: '🏠' },
    { value: 'etc', label: '기타', emoji: '💰' },
  ]
  
  categories.forEach(cat => {
    console.log(`${cat.emoji} ${cat.label} (${cat.value})`)
  })
  
  console.log(`✅ 총 ${categories.length}개 카테고리 정의됨\n`)
}

// 브라우저 window 객체에 함수 등록
if (typeof window !== 'undefined') {
  (window as any).runExpenseFormTests = runExpenseFormTests;
  (window as any).testCategoryMapping = testCategoryMapping;
  (window as any).testSplitCalculations = testSplitCalculations;
}

export { runExpenseFormTests, testCategoryMapping, testSplitCalculations }