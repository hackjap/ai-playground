import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { setBudget } from '@/lib/supabase'
import type { DatabaseBudget } from '@/types'

interface BudgetFormProps {
  pairId: string
  currentBudget?: DatabaseBudget | null
  onSuccess?: () => void
  onClose?: () => void
}

export default function BudgetForm({ 
  pairId, 
  currentBudget, 
  onSuccess, 
  onClose 
}: BudgetFormProps) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const [totalBudget, setTotalBudget] = useState(
    currentBudget?.total_budget?.toString() || ''
  )
  const [alertThreshold, setAlertThreshold] = useState(
    currentBudget?.alert_threshold ? (currentBudget.alert_threshold * 100).toString() : '80'
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!totalBudget || isNaN(Number(totalBudget)) || Number(totalBudget) <= 0) {
      setError('올바른 예산 금액을 입력해주세요.')
      return
    }

    if (!alertThreshold || isNaN(Number(alertThreshold)) || Number(alertThreshold) < 0 || Number(alertThreshold) > 100) {
      setError('알림 기준은 0~100 사이의 숫자를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      await setBudget({
        pair_id: pairId,
        budget_year: currentYear,
        budget_month: currentMonth,
        total_budget: Number(totalBudget),
        alert_threshold: Number(alertThreshold) / 100, // 퍼센트를 소수점으로 변환
        category_budgets: currentBudget?.category_budgets || {},
      })

      console.log('예산 설정 완료')
      onSuccess?.()
    } catch (err) {
      console.error('예산 설정 실패:', err)
      setError(err instanceof Error ? err.message : '예산 설정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {currentBudget ? '예산 수정' : '예산 설정'}
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="total-budget" className="text-sm font-medium">
                이번 달 예산 ({currentYear}년 {currentMonth}월)
              </Label>
              <div className="relative mt-1">
                <Input
                  id="total-budget"
                  type="number"
                  placeholder="1000000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="pr-8"
                  min="0"
                  step="1000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              {totalBudget && !isNaN(Number(totalBudget)) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(Number(totalBudget))}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="alert-threshold" className="text-sm font-medium">
                알림 기준 (예산 대비 %)
              </Label>
              <div className="relative mt-1">
                <Input
                  id="alert-threshold"
                  type="number"
                  placeholder="80"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="pr-8"
                  min="0"
                  max="100"
                  step="5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                예산의 {alertThreshold}% 초과 시 알림을 받습니다
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? '저장 중...' : '예산 저장'}
              </Button>
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  취소
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}