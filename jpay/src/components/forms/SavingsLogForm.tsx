import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateSavingsLog, useUpdateSavingsLog } from '@/hooks/useSavingsLogs'
import { formatCurrency } from '@/lib/utils'
import { X, Wallet } from 'lucide-react'

interface SavingsLogFormProps {
  goalId: string
  editingLog?: any
  onClose: () => void
  onSuccess: () => void
}

export default function SavingsLogForm({ goalId, editingLog, onClose, onSuccess }: SavingsLogFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    memo: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createSavingsLog = useCreateSavingsLog()
  const updateSavingsLog = useUpdateSavingsLog()

  const isEditing = !!editingLog

  useEffect(() => {
    if (editingLog) {
      setFormData({
        amount: editingLog.amount.toString(),
        date: new Date(editingLog.date).toISOString().split('T')[0],
        memo: editingLog.memo || ''
      })
    }
  }, [editingLog])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = '유효한 저축 금액을 입력해주세요'
    }

    if (!formData.date) {
      newErrors.date = '저축 날짜를 선택해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (isEditing) {
        await updateSavingsLog.mutateAsync({
          id: editingLog.id,
          updates: {
            amount: Number(formData.amount),
            date: new Date(formData.date).toISOString(),
            memo: formData.memo.trim() || null
          }
        })
      } else {
        await createSavingsLog.mutateAsync({
          goal_id: goalId,
          amount: Number(formData.amount),
          date: new Date(formData.date).toISOString(),
          memo: formData.memo.trim() || null
        })
      }
      
      onSuccess()
    } catch (error) {
      console.error(`저축 내역 ${isEditing ? '수정' : '추가'} 실패:`, error)
      alert(`저축 내역 ${isEditing ? '수정' : '추가'}에 실패했습니다. 다시 시도해주세요.`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatInputAmount = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    return numericValue ? Number(numericValue).toLocaleString() : ''
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {isEditing ? '저축 수정' : '저축 추가'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">저축 금액 *</Label>
              <div className="relative">
                <Input
                  id="amount"
                  placeholder="100,000"
                  value={formatInputAmount(formData.amount)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    handleInputChange('amount', value)
                  }}
                  className={errors.amount ? 'border-red-500 pr-12' : 'pr-12'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
              {formData.amount && !errors.amount && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(formData.amount) || 0)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">저축 날짜 *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">메모 (선택사항)</Label>
              <Textarea
                id="memo"
                placeholder="예: 용돈에서 저축, 보너스에서 추가"
                value={formData.memo}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                maxLength={200}
                rows={3}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.memo.length}/200
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createSavingsLog.isPending || updateSavingsLog.isPending}
              >
                {isEditing ? '저축 수정' : '저축 추가'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}