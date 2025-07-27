import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { DatabaseExpense } from '@/types'

interface HistoryListProps {
  expenses: DatabaseExpense[]
  currentUserId: string
  isLoading?: boolean
  onSettleClick?: () => void
  showSettleButton?: boolean
}

type TabType = 'current' | 'settled'

const CATEGORY_LABELS: Record<string, string> = {
  'food': '외식',
  'transport': '교통',
  'shopping': '쇼핑',
  'utilities': '생활용품',
  'etc': '기타',
}

export default function HistoryList({
  expenses,
  currentUserId,
  isLoading = false,
  onSettleClick,
  showSettleButton = false
}: HistoryListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('current')

  // 탭별 지출 필터링
  const currentExpenses = expenses.filter(expense => !expense.is_settled)
  const settledExpenses = expenses.filter(expense => expense.is_settled)

  const displayExpenses = activeTab === 'current' ? currentExpenses : settledExpenses

  // 현재 탭의 총 금액 계산
  const totalAmount = displayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // 현재 지출의 잔액 계산
  const currentBalance = currentExpenses.reduce((sum, expense) => {
    if (expense.paid_by === currentUserId) {
      return sum + (expense.amount - (expense.amount * expense.split_ratio))
    } else {
      return sum - (expense.amount * (1 - expense.split_ratio))
    }
  }, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category] || category
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>지출 내역</CardTitle>
          {showSettleButton && currentExpenses.length > 0 && (
            <Button
              onClick={onSettleClick}
              variant="outline"
              size="sm"
              className="text-primary"
            >
              정산하기
            </Button>
          )}
        </div>

        {/* 탭 버튼 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'current'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            현재 ({currentExpenses.length})
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'settled'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            정산완료 ({settledExpenses.length})
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* 현재 탭 요약 정보 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {activeTab === 'current' ? '현재 총 지출' : '정산완료 총액'}
            </span>
            <span className="font-medium">{formatCurrency(totalAmount)}</span>
          </div>
          {activeTab === 'current' && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">주고받을 금액</span>
              <span className={`font-medium ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentBalance >= 0 ? '+' : ''}{formatCurrency(currentBalance)}
              </span>
            </div>
          )}
        </div>

        {/* 지출 목록 */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              로딩 중...
            </div>
          ) : displayExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {activeTab === 'current' 
                ? '아직 등록된 지출이 없습니다.' 
                : '정산 완료된 지출이 없습니다.'
              }
            </div>
          ) : (
            displayExpenses.map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  expense.is_settled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{expense.title}</span>
                    {expense.is_settled && (
                      <Badge variant="secondary" className="text-xs">
                        정산완료
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(expense.expense_date)}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(expense.category)}
                    </Badge>
                    <span>•</span>
                    <span>{expense.paid_by === currentUserId ? '내가 결제' : '상대방 결제'}</span>
                  </div>
                  {expense.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {expense.description}
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  <div className="font-bold">{formatCurrency(expense.amount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {expense.split_ratio === 0.5 ? '반반' : 
                     expense.split_ratio === 1 ? '전액' :
                     expense.split_ratio === 0 ? '상대방 전액' :
                     `${Math.round(expense.split_ratio * 100)}:${Math.round((1 - expense.split_ratio) * 100)}`
                    }
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}