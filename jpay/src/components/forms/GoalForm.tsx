import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateGoal, useUpdateGoal } from '@/hooks/useGoals'
import { formatCurrency } from '@/lib/utils'
import { X, Target } from 'lucide-react'
import type { DatabaseGoal } from '@/types'

interface GoalFormProps {
  pairId: string
  existingGoal?: DatabaseGoal | null
  onClose: () => void
  onSuccess: () => void
}

export default function GoalForm({ pairId, existingGoal, onClose, onSuccess }: GoalFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: existingGoal?.name || '',
    targetAmount: existingGoal?.target_amount?.toString() || '',
    deadline: existingGoal?.deadline ? existingGoal.deadline.split('T')[0] : ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()

  const isEditing = !!existingGoal

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 목표 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '목표 이름을 입력해주세요'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = '목표 이름은 50자 이하로 입력해주세요'
    }

    // 목표 금액 검증
    if (!formData.targetAmount) {
      newErrors.targetAmount = '목표 금액을 입력해주세요'
    } else {
      const amount = Number(formData.targetAmount)
      if (isNaN(amount)) {
        newErrors.targetAmount = '올바른 숫자를 입력해주세요'
      } else if (amount < 1000) {
        newErrors.targetAmount = '목표 금액은 최소 1,000원 이상이어야 합니다'
      } else if (amount > 1000000000) {
        newErrors.targetAmount = '목표 금액은 10억원 이하로 설정해주세요'
      }
    }

    // 목표 일자 검증
    if (formData.deadline) {
      const today = new Date()
      const selectedDate = new Date(formData.deadline)
      
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate <= today) {
        newErrors.deadline = '목표 일자는 내일 이후로 설정해주세요'
      }
      
      // 최대 10년 후까지만 설정 가능
      const maxDate = new Date()
      maxDate.setFullYear(maxDate.getFullYear() + 10)
      if (selectedDate > maxDate) {
        newErrors.deadline = '목표 일자는 10년 이내로 설정해주세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrors({}) // 기존 에러 메시지 클리어

    try {
      if (isEditing && existingGoal) {
        await updateGoal.mutateAsync({
          id: existingGoal.id,
          updates: {
            name: formData.name.trim(),
            target_amount: Number(formData.targetAmount),
            deadline: formData.deadline || null
          }
        })
      } else {
        const newGoal = await createGoal.mutateAsync({
          pair_id: pairId,
          name: formData.name.trim(),
          target_amount: Number(formData.targetAmount),
          deadline: formData.deadline || null,
          icon_url: null,
          is_completed: false,
          completed_at: null
        })
        
        // 새 목표 생성 후 상세 페이지로 이동
        navigate(`/goals/${newGoal.id}`)
        return
      }
      
      onSuccess()
    } catch (error: any) {
      console.error('목표 저장 실패:', error)
      
      // Supabase 에러 메시지 파싱
      let errorMessage = `목표 ${isEditing ? '수정' : '생성'}에 실패했습니다.`
      
      if (error?.message?.includes('duplicate')) {
        errorMessage = '동일한 이름의 목표가 이미 존재합니다.'
      } else if (error?.message?.includes('network')) {
        errorMessage = '네트워크 연결을 확인해주세요.'
      } else if (error?.message?.includes('permission')) {
        errorMessage = '권한이 없습니다. 다시 로그인해주세요.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
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
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isEditing ? '목표 수정' : '새 목표 만들기'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">목표 이름 *</Label>
              <Input
                id="name"
                placeholder="예: 제주도 여행, 냉장고 구매"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              <p className="text-xs text-muted-foreground">
                {formData.name.length}/50자
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">목표 금액 *</Label>
              <div className="relative">
                <Input
                  id="targetAmount"
                  placeholder="1,000,000"
                  value={formatInputAmount(formData.targetAmount)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    handleInputChange('targetAmount', value)
                  }}
                  className={errors.targetAmount ? 'border-red-500 pr-12' : 'pr-12'}
                  disabled={isSubmitting}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              {errors.targetAmount && <p className="text-sm text-red-600">{errors.targetAmount}</p>}
              {formData.targetAmount && !errors.targetAmount && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(formData.targetAmount) || 0)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                최소 1,000원 ~ 최대 10억원
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">목표 일자 (선택사항)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
                className={errors.deadline ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.deadline && <p className="text-sm text-red-600">{errors.deadline}</p>}
              <p className="text-xs text-muted-foreground">
                목표 달성 예정일을 설정하면 진행률 계산에 도움이 됩니다
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || createGoal.isPending || updateGoal.isPending}
              >
                {isSubmitting ? '처리 중...' : (isEditing ? '수정' : '만들기')}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}