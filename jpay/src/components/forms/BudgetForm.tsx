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
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 실시간 입력값 변경 시 에러 메시지 클리어
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalBudget(e.target.value)
    if (error) setError(null)
  }

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertThreshold(e.target.value)
    if (error) setError(null)
  }

  const validateInputs = () => {
    // 예산 금액 검증
    if (!totalBudget || totalBudget.trim() === '') {
      return '예산 금액을 입력해주세요.'
    }

    const budgetNumber = Number(totalBudget)
    if (isNaN(budgetNumber)) {
      return '예산 금액은 숫자만 입력 가능합니다.'
    }

    if (budgetNumber < 0) {
      return '예산 금액은 0 이상이어야 합니다.'
    }

    if (budgetNumber > 999999999) {
      return '예산 금액이 너무 큽니다. (최대 999,999,999원)'
    }

    // 소수점 검증
    if (budgetNumber % 1 !== 0) {
      return '예산 금액은 정수로 입력해주세요.'
    }

    // 알림 기준 검증
    if (!alertThreshold || alertThreshold.trim() === '') {
      return '알림 기준을 입력해주세요.'
    }

    const thresholdNumber = Number(alertThreshold)
    if (isNaN(thresholdNumber)) {
      return '알림 기준은 숫자만 입력 가능합니다.'
    }

    if (thresholdNumber < 0 || thresholdNumber > 100) {
      return '알림 기준은 0~100 사이의 숫자를 입력해주세요.'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // upsert 사용하여 insert/update 자동 처리
      await setBudget({
        pair_id: pairId,
        budget_year: currentYear,
        budget_month: currentMonth,
        total_budget: Number(totalBudget),
        alert_threshold: Number(alertThreshold) / 100,
        category_budgets: currentBudget?.category_budgets || {},
      })

      setSuccessMessage(currentBudget ? '예산이 수정되었습니다.' : '예산이 설정되었습니다.')
      
      // 성공 메시지를 잠시 보여준 후 콜백 실행
      setTimeout(() => {
        onSuccess?.()
      }, 1000)
    } catch (err) {
      console.error('예산 설정 실패:', err)
      let errorMessage = '예산 설정에 실패했습니다.'
      
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인하고 다시 시도해주세요.'
        } else if (err.message.includes('timeout')) {
          errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setSuccessMessage(null)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
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
                  onChange={handleBudgetChange}
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
                  onChange={handleThresholdChange}
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
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  {(error.includes('네트워크') || error.includes('시간') || error.includes('실패')) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      재시도
                    </Button>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                {successMessage}
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