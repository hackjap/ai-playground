import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { createPair, getAnonymousUserId, settleAllCurrentExpenses } from '@/lib/supabase'
import ExpenseForm from '@/components/forms/ExpenseForm'
import BudgetForm from '@/components/forms/BudgetForm'
import CategoryChart from '@/components/charts/CategoryChart'
import TrendChart from '@/components/charts/TrendChart'
import { BudgetProgress } from '@/components/ui/gauge-bar'
import { analyzeExpenses } from '@/utils/chartData'
import { useExpenses, useInvalidateExpenses } from '@/hooks/useExpenses'
import { useBudget, useInvalidateBudget, useBudgetAnalysis } from '@/hooks/useBudget'
import SettlementModal from '@/components/modals/SettlementModal'
import HistoryList from '@/components/history/HistoryList'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export default function Dashboard() {
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false)
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false)
  const [pairId, setPairId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // React Query를 사용한 데이터 fetching
  const { data: expenses, isLoading: isLoadingExpenses } = useExpenses(pairId)
  const { data: currentBudget, isLoading: isLoadingBudget } = useBudget(pairId)
  const invalidateExpenses = useInvalidateExpenses()
  const invalidateBudget = useInvalidateBudget()
  
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

  const handleBudgetSuccess = () => {
    setIsBudgetFormOpen(false)
    // 예산 설정 후 데이터 새로고침
    if (pairId) {
      invalidateBudget(pairId)
    }
  }

  const handleSettlement = async () => {
    if (!pairId) return
    
    try {
      await settleAllCurrentExpenses(pairId)
      // 정산 후 데이터 새로고침
      invalidateExpenses(pairId)
      setIsSettlementModalOpen(false)
    } catch (error) {
      console.error('정산 처리 실패:', error)
      alert('정산 처리에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 통계 계산
  const currentUserId = getAnonymousUserId()
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  
  // 차트 데이터 분석
  const expenseAnalysis = analyzeExpenses(expenses || [], currentUserId, currentMonth)
  const { totalAmount, categoryData, monthlyTrend, balance } = expenseAnalysis
  
  // 예산 분석
  const budgetAnalysis = useBudgetAnalysis(currentBudget, totalAmount)
  
  // 기존 계산들 (호환성 유지)
  const myOwedAmount = balance

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
    { 
      label: '예산 대비 사용률', 
      value: budgetAnalysis.hasBudget 
        ? `${Math.round(budgetAnalysis.spentPercentage)}%`
        : '예산 미설정'
    },
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
          <p className="text-slate-600 mb-4">
            {myOwedAmount >= 0 ? '받을 금액' : '줄 금액'}
          </p>
          {Math.abs(myOwedAmount) > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsSettlementModalOpen(true)}
              className="bg-white/50 hover:bg-white/80"
            >
              정산하기
            </Button>
          )}
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

      {/* Budget Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">월 예산</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsBudgetFormOpen(true)}
              disabled={isLoadingBudget}
            >
              {budgetAnalysis.hasBudget ? '수정' : '설정'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgetAnalysis.hasBudget ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>사용: {formatCurrency(budgetAnalysis.spentAmount)}</span>
                <span>예산: {formatCurrency(budgetAnalysis.budgetAmount)}</span>
              </div>
              <BudgetProgress 
                spent={budgetAnalysis.spentAmount}
                budget={budgetAnalysis.budgetAmount}
                alertThreshold={budgetAnalysis.alertThreshold}
              />
              {budgetAnalysis.isOverBudget && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  ⚠️ 예산을 {formatCurrency(budgetAnalysis.spentAmount - budgetAnalysis.budgetAmount)} 초과했습니다
                </div>
              )}
              {budgetAnalysis.isNearAlert && !budgetAnalysis.isOverBudget && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  ⚠️ 예산의 {budgetAnalysis.alertThreshold}%에 도달했습니다
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                이번 달 예산을 설정하여 지출을 관리해보세요
              </div>
              <Button onClick={() => setIsBudgetFormOpen(true)}>
                예산 설정하기
              </Button>
            </div>
          )}
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

      {/* History List */}
      <HistoryList
        expenses={expenses || []}
        currentUserId={currentUserId}
        isLoading={isLoadingExpenses}
        showSettleButton={Math.abs(myOwedAmount) > 0}
        onSettleClick={() => setIsSettlementModalOpen(true)}
      />

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

      {/* Budget Form Modal */}
      {isBudgetFormOpen && (
        <BudgetForm
          pairId={pairId}
          currentBudget={currentBudget}
          onClose={() => setIsBudgetFormOpen(false)}
          onSuccess={handleBudgetSuccess}
        />
      )}

      {/* Settlement Modal */}
      {isSettlementModalOpen && (
        <SettlementModal
          balance={myOwedAmount}
          currentUserId={currentUserId}
          onConfirm={handleSettlement}
          onClose={() => setIsSettlementModalOpen(false)}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}