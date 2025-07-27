import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { createPair, getAnonymousUserId } from '@/lib/supabase'
import ExpenseForm from '@/components/forms/ExpenseForm'
import CategoryChart from '@/components/charts/CategoryChart'
import TrendChart from '@/components/charts/TrendChart'
import { analyzeExpenses } from '@/utils/chartData'
import { useExpenses, useInvalidateExpenses } from '@/hooks/useExpenses'

export default function Dashboard() {
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const [pairId, setPairId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // React Query를 사용한 데이터 fetching
  const { data: expenses, isLoading: isLoadingExpenses } = useExpenses(pairId)
  const invalidateExpenses = useInvalidateExpenses()
  
  // 페어 생성 또는 로드
  useEffect(() => {
    const initializePair = async () => {
      try {
        // 실제 환경에서는 localStorage에서 기존 페어 ID를 확인
        const savedPairId = localStorage.getItem('jpay_current_pair_id')
        
        if (savedPairId) {
          setPairId(savedPairId)
        } else {
          // 새 페어 생성
          const newPair = await createPair('테스트 페어')
          setPairId(newPair.id)
          localStorage.setItem('jpay_current_pair_id', newPair.id)
        }
      } catch (error) {
        console.error('페어 초기화 실패:', error)
        // 폴백으로 UUID 생성
        const fallbackId = crypto.randomUUID()
        setPairId(fallbackId)
        localStorage.setItem('jpay_current_pair_id', fallbackId)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializePair()
  }, [])

  const handleExpenseSuccess = () => {
    setIsExpenseFormOpen(false)
    // 지출 등록 후 데이터 새로고침 (React Query 캐시 무효화)
    if (pairId) {
      invalidateExpenses(pairId)
    }
  }

  // 통계 계산
  const currentUserId = getAnonymousUserId()
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  
  // 차트 데이터 분석
  const expenseAnalysis = analyzeExpenses(expenses || [], currentUserId, currentMonth)
  const { totalAmount, categoryData, monthlyTrend, balance } = expenseAnalysis
  
  // 기존 계산들 (호환성 유지)
  const myOwedAmount = balance
  
  // 임시 예산 (실제로는 budgets 테이블에서 가져와야 함)
  const monthlyBudget = 800000
  const budgetPercentage = Math.round((totalAmount / monthlyBudget) * 100)

  // 어제 지출 계산
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const yesterdayAmount = (expenses || [])
    .filter(expense => expense.expense_date === yesterdayStr)
    .reduce((sum, expense) => sum + expense.amount, 0)

  // 가장 많이 쓴 카테고리
  const topCategory = categoryData.length > 0 ? categoryData[0].label : '없음'

  const quickStats = [
    { label: '이번 달 총 지출', value: formatCurrency(totalAmount) },
    { label: '어제 지출', value: formatCurrency(yesterdayAmount) },
    { label: '예산 대비 사용률', value: `${budgetPercentage}%` },
    { label: '가장 많은 카테고리', value: topCategory },
  ]

  // 최근 지출 (최대 3개)
  const recentExpenses = (expenses || []).slice(0, 3).map(expense => ({
    description: expense.title,
    amount: expense.amount,
    payer: expense.paid_by === currentUserId ? '나' : '상대방',
    category: expense.category,
  }))

  // 로딩 중일 때 표시
  if (isLoading || !pairId) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">페어 초기화 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">PairPay</h1>
        <Button variant="ghost" size="sm">
          ⚙️
        </Button>
      </header>

      {/* Balance Card */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-0">
          <Badge variant="secondary" className="mb-2">
            {myOwedAmount >= 0 ? '상대방이 나에게' : '내가 상대방에게'}
          </Badge>
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {formatCurrency(Math.abs(myOwedAmount))}
          </div>
          <p className="text-slate-600">
            {myOwedAmount >= 0 ? '받을 금액' : '줄 금액'}
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">월 예산</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(totalAmount)}</span>
              <span>{formatCurrency(monthlyBudget)}</span>
            </div>
            <Progress 
              value={budgetPercentage} 
              variant={budgetPercentage > 80 ? 'danger' : budgetPercentage > 60 ? 'warning' : 'default'}
            />
            <div className="text-center">
              <Badge variant={budgetPercentage > 80 ? 'destructive' : 'secondary'}>
                {budgetPercentage}% 사용
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      {totalAmount > 0 && (
        <>
          {/* Category Chart */}
          <CategoryChart 
            data={categoryData} 
            title="이번 달 카테고리별 지출"
          />
          
          {/* Trend Chart */}
          <TrendChart 
            data={monthlyTrend} 
            title="최근 6개월 지출 트렌드"
          />
        </>
      )}

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>최근 지출</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingExpenses ? (
            <div className="text-center py-4 text-slate-500">
              지출 내역을 불러오는 중...
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="text-center py-4 text-slate-500">
              아직 등록된 지출이 없습니다.
            </div>
          ) : (
            recentExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {expense.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(expense.amount)}</div>
                  <div className="text-sm text-slate-500">{expense.payer}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* FAB */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
        onClick={() => setIsExpenseFormOpen(true)}
      >
        <span className="text-2xl">+</span>
      </Button>

      {/* Expense Form Modal */}
      {isExpenseFormOpen && (
        <ExpenseForm
          pairId={pairId}
          onClose={() => setIsExpenseFormOpen(false)}
          onSuccess={handleExpenseSuccess}
        />
      )}
    </div>
  )
}