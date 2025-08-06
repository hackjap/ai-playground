import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import BudgetForm from '@/components/forms/BudgetForm'
import { BudgetProgress } from '@/components/ui/gauge-bar'
import { useBudget, useBudgetAnalysis } from '@/hooks/useBudget'
import { useExpenses } from '@/hooks/useExpenses'
import { PieChart, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Budget() {
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false)
  const [pairId, setPairId] = useState<string | null>(null)
  
  // React Query를 사용한 데이터 fetching
  const { data: currentBudget, isLoading: isLoadingBudget } = useBudget(pairId)
  const { data: expenses, isLoading: isLoadingExpenses } = useExpenses(pairId)
  
  // 페어 ID 로드
  useEffect(() => {
    const savedPairId = localStorage.getItem('jpay_current_pair_id')
    if (savedPairId) {
      setPairId(savedPairId)
    }
  }, [])

  // 현재 월 총 지출 계산
  const currentDate = new Date()
  const currentMonth = currentDate.toISOString().slice(0, 7) // YYYY-MM 형식
  
  const currentMonthExpenses = expenses?.filter(expense => 
    expense.expense_date.startsWith(currentMonth) && !expense.is_settled
  ) || []
  
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // 예산 분석
  const budgetAnalysis = useBudgetAnalysis(currentBudget, totalExpenses)

  const handleBudgetSuccess = () => {
    setIsBudgetFormOpen(false)
  }

  // 카테고리별 지출 분석
  const categoryExpenses = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const categoryLabels = {
    food: '외식',
    transport: '교통',
    shopping: '쇼핑',
    utilities: '생활용품',
    etc: '기타'
  }

  if (isLoadingBudget || isLoadingExpenses) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">예산 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">예산 관리</h1>
          <p className="text-slate-600">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 예산 현황
          </p>
        </div>
        <Button
          onClick={() => setIsBudgetFormOpen(true)}
          className="flex items-center space-x-2"
        >
          <PieChart size={16} />
          <span>{currentBudget ? '예산 수정' : '예산 설정'}</span>
        </Button>
      </div>

      {/* 예산 현황 카드 */}
      {budgetAnalysis.hasBudget ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>월 예산 현황</span>
              <div className="flex items-center space-x-2">
                {budgetAnalysis.isOverBudget ? (
                  <AlertTriangle className="text-red-500" size={16} />
                ) : budgetAnalysis.isNearAlert ? (
                  <TrendingUp className="text-yellow-500" size={16} />
                ) : (
                  <CheckCircle className="text-green-500" size={16} />
                )}
                <span className={`text-sm font-medium ${
                  budgetAnalysis.isOverBudget ? 'text-red-600' : 
                  budgetAnalysis.isNearAlert ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {budgetAnalysis.isOverBudget ? '예산 초과' : 
                   budgetAnalysis.isNearAlert ? '주의 필요' : '안전한 수준'}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">사용 금액</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(budgetAnalysis.spentAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">예산</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(budgetAnalysis.budgetAmount)}
                </p>
              </div>
            </div>
            
            <BudgetProgress
              spent={budgetAnalysis.spentAmount}
              budget={budgetAnalysis.budgetAmount}
              alertThreshold={budgetAnalysis.alertThreshold * 100}
            />
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                사용률: {Math.round(budgetAnalysis.spentPercentage)}%
              </span>
              <span className="text-slate-600">
                남은 예산: {formatCurrency(budgetAnalysis.remainingAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <PieChart className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              예산을 설정해보세요
            </h3>
            <p className="text-slate-600 mb-6">
              이번 달 예산을 설정하여 지출을 체계적으로 관리해보세요
            </p>
            <Button onClick={() => setIsBudgetFormOpen(true)}>
              예산 설정하기
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 카테고리별 지출 분석 */}
      {currentMonthExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 지출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryExpenses)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .map(([category, amount]) => {
                  const amountNum = amount as number
                  const percentage = budgetAnalysis.hasBudget 
                    ? (amountNum / budgetAnalysis.budgetAmount) * 100 
                    : (amountNum / totalExpenses) * 100
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                        <span className="text-sm font-medium">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(amountNum)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {Math.round(percentage)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예산 팁 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp size={16} />
            <span>예산 관리 팁</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p>매월 첫째 주에 예산을 설정하고 주간별로 지출을 확인해보세요</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p>예산의 80% 도달 시 알림을 받아 과소비를 방지할 수 있습니다</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <p>카테고리별 지출 비중을 확인하여 절약 포인트를 찾아보세요</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Form Modal */}
      {isBudgetFormOpen && pairId && (
        <BudgetForm
          pairId={pairId}
          currentBudget={currentBudget}
          onClose={() => setIsBudgetFormOpen(false)}
          onSuccess={handleBudgetSuccess}
        />
      )}
    </div>
  )
}