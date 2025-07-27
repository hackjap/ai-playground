import type { DatabaseExpense } from '@/types'
import { formatCurrency } from '@/lib/utils'

export interface ChartDataPoint {
  category: string
  amount: number
  percentage: number
  color: string
  label: string
}

export interface MonthlyTrendData {
  month: string
  totalAmount: number
  myAmount: number
  partnerAmount: number
}

export interface ExpenseAnalysis {
  totalAmount: number
  myAmount: number
  partnerAmount: number
  categoryData: ChartDataPoint[]
  monthlyTrend: MonthlyTrendData[]
  balance: number
}

// 카테고리별 색상 정의
const CATEGORY_COLORS: Record<string, string> = {
  'food': '#ef4444',      // 외식 - red
  'transport': '#3b82f6', // 교통 - blue  
  'shopping': '#8b5cf6',  // 쇼핑 - purple
  'utilities': '#10b981', // 생활용품 - green
  'etc': '#6b7280',       // 기타 - gray
}

// 카테고리별 한글 라벨
const CATEGORY_LABELS: Record<string, string> = {
  'food': '외식',
  'transport': '교통',
  'shopping': '쇼핑', 
  'utilities': '생활용품',
  'etc': '기타',
}

/**
 * 지출 데이터를 분석하여 차트에 필요한 데이터를 생성합니다.
 */
export function analyzeExpenses(
  expenses: DatabaseExpense[], 
  currentUserId: string,
  targetMonth?: string
): ExpenseAnalysis {
  // 현재 월 필터링 (targetMonth가 없으면 현재 월)
  const filterMonth = targetMonth || new Date().toISOString().slice(0, 7)
  const filteredExpenses = expenses.filter(expense => 
    expense.expense_date.startsWith(filterMonth)
  )

  // 총 지출 계산
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // 개인별 지출 계산
  const myExpenses = filteredExpenses.filter(expense => expense.paid_by === currentUserId)
  const myAmount = myExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const partnerAmount = totalAmount - myAmount

  // 잔액 계산 (복잡한 분담비 계산 포함)
  const balance = filteredExpenses.reduce((sum, expense) => {
    if (expense.paid_by === currentUserId) {
      // 내가 낸 경우: 내가 낸 금액 - 내 분담금
      return sum + (expense.amount - (expense.amount * expense.split_ratio))
    } else {
      // 상대방이 낸 경우: 내 분담금만큼 빚
      return sum - (expense.amount * (1 - expense.split_ratio))
    }
  }, 0)

  // 카테고리별 집계
  const categoryTotals: Record<string, number> = {}
  filteredExpenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  // 카테고리 차트 데이터 생성
  const categoryData: ChartDataPoint[] = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalAmount) * 100),
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.etc,
      label: CATEGORY_LABELS[category] || category,
    }))
    .sort((a, b) => b.amount - a.amount) // 금액순 정렬

  // 월별 트렌드 데이터 생성 (최근 6개월)
  const monthlyTrend = generateMonthlyTrend(expenses, currentUserId, 6)

  return {
    totalAmount,
    myAmount,
    partnerAmount, 
    categoryData,
    monthlyTrend,
    balance,
  }
}

/**
 * 월별 트렌드 데이터를 생성합니다.
 */
function generateMonthlyTrend(
  expenses: DatabaseExpense[], 
  currentUserId: string, 
  monthCount: number
): MonthlyTrendData[] {
  const now = new Date()
  const trends: MonthlyTrendData[] = []

  for (let i = monthCount - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = targetDate.toISOString().slice(0, 7) // YYYY-MM

    const monthExpenses = expenses.filter(expense => 
      expense.expense_date.startsWith(monthStr)
    )

    const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const myAmount = monthExpenses
      .filter(expense => expense.paid_by === currentUserId)
      .reduce((sum, expense) => sum + expense.amount, 0)
    const partnerAmount = totalAmount - myAmount

    trends.push({
      month: targetDate.toLocaleDateString('ko-KR', { month: 'short' }), // "1월", "2월" 형식
      totalAmount,
      myAmount,
      partnerAmount,
    })
  }

  return trends
}

/**
 * 카테고리 차트를 위한 Recharts 데이터 형식으로 변환
 */
export function formatCategoryChartData(categoryData: ChartDataPoint[]) {
  return categoryData.map((item) => ({
    ...item,
    fill: item.color,
    // 파이 차트용 추가 데이터
    name: item.label,
    value: item.amount,
  }))
}

/**
 * 월별 트렌드 차트를 위한 Recharts 데이터 형식으로 변환
 */
export function formatTrendChartData(monthlyTrend: MonthlyTrendData[]) {
  return monthlyTrend.map(item => ({
    month: item.month,
    total: item.totalAmount,
    me: item.myAmount,
    partner: item.partnerAmount,
  }))
}

/**
 * 차트 툴팁용 포맷터
 */
export function formatChartValue(value: number): string {
  return formatCurrency(value)
}

/**
 * 퍼센테이지 포맷터
 */
export function formatPercentage(value: number): string {
  return `${value}%`
}