import { differenceInMonths, isAfter, startOfMonth } from 'date-fns'

export interface RecommendedSavingsResult {
  monthlyAmount: number
  remainingAmount: number
  remainingMonths: number
  isOverdue: boolean
  completionRate: number
}

export const calculateRecommendedSavings = (
  currentAmount: number,
  targetAmount: number,
  targetDate: Date
): RecommendedSavingsResult => {
  const now = new Date()
  const currentMonth = startOfMonth(now)
  const targetMonth = startOfMonth(targetDate)
  
  // 남은 금액 계산
  const remainingAmount = Math.max(targetAmount - currentAmount, 0)
  
  // 남은 개월 수 계산 (현재 월 포함)
  const remainingMonths = Math.max(differenceInMonths(targetMonth, currentMonth) + 1, 1)
  
  // 목표 달성률 계산
  const completionRate = Math.min((currentAmount / targetAmount) * 100, 100)
  
  // 월별 권장 저축액 계산
  const monthlyAmount = remainingAmount / remainingMonths
  
  // 기한 초과 여부 확인
  const isOverdue = isAfter(now, targetDate)
  
  return {
    monthlyAmount: Math.ceil(monthlyAmount),
    remainingAmount,
    remainingMonths,
    isOverdue,
    completionRate
  }
}

export const formatKoreanWon = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount)
}

export const getProgressMessage = (
  completionRate: number,
  remainingMonths: number,
  isOverdue: boolean
): string => {
  if (completionRate >= 100) {
    return "🎉 목표를 달성했습니다!"
  }
  
  if (isOverdue) {
    return "⚠️ 목표 기한이 지났습니다"
  }
  
  if (remainingMonths <= 1) {
    return "🏃‍♂️ 이번 달이 마지막 기회입니다!"
  }
  
  if (completionRate >= 80) {
    return "🔥 목표 달성이 거의 다 되었습니다!"
  }
  
  if (completionRate >= 50) {
    return "💪 순조롭게 진행되고 있습니다"
  }
  
  return "📈 꾸준히 저축해보세요"
}