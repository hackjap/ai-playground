import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Check, AlertCircle } from 'lucide-react'
import { addExpense, getAnonymousUserId } from '@/lib/supabase'
import type { ExpenseCategory } from '@/types'

interface ExpenseFormProps {
  pairId: string
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  amount: string
  title: string
  description: string
  category: ExpenseCategory | ''
  expenseDate: string
  splitRatio: number
  memo: string
}

const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'food', label: '외식', emoji: '🍽️' },
  { value: 'transport', label: '교통', emoji: '🚗' },
  { value: 'shopping', label: '쇼핑', emoji: '🛍️' },
  { value: 'utilities', label: '생활용품', emoji: '🏠' },
  { value: 'etc', label: '기타', emoji: '💰' },
]

const SPLIT_OPTIONS = [
  { value: 0.5, label: '반반 (50:50)', description: '동등하게 나누어 부담' },
  { value: 1.0, label: '내가 전액 부담', description: '상대방 부담 없음' },
  { value: 0.0, label: '상대방이 전액 부담', description: '내 부담 없음' },
]

export default function ExpenseForm({ pairId, onClose, onSuccess }: ExpenseFormProps) {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    title: '',
    description: '',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0],
    splitRatio: 0.5,
    memo: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = '금액을 올바르게 입력해주세요'
    }

    if (!formData.title.trim()) {
      newErrors.title = '지출 내용을 입력해주세요'
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요'
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = '날짜를 선택해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const userId = getAnonymousUserId()
      
      await addExpense({
        pair_id: pairId,
        amount: parseFloat(formData.amount),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        expense_date: formData.expenseDate,
        paid_by: userId,
        split_ratio: formData.splitRatio,
        category: formData.category as string,
        memo: formData.memo.trim() || null,
        receipt_url: null,
        is_settled: false,
        settled_at: null,
      })

      setSubmitStatus('success')
      
      // 성공 후 폼 초기화
      setFormData({
        amount: '',
        title: '',
        description: '',
        category: '',
        expenseDate: new Date().toISOString().split('T')[0],
        splitRatio: 0.5,
        memo: '',
      })

      // 성공 콜백 호출
      if (onSuccess) {
        setTimeout(onSuccess, 1000)
      }

    } catch (error) {
      console.error('지출 등록 실패:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 에러 상태 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const getMyShareAmount = () => {
    const amount = parseFloat(formData.amount) || 0
    return (amount * formData.splitRatio).toLocaleString('ko-KR')
  }

  const getPartnerShareAmount = () => {
    const amount = parseFloat(formData.amount) || 0
    return (amount * (1 - formData.splitRatio)).toLocaleString('ko-KR')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">지출 등록</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 금액 입력 */}
            <div className="space-y-2">
              <Label htmlFor="amount">금액 *</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`text-right text-xl font-bold pr-8 ${errors.amount ? 'border-red-500' : ''}`}
                  min="0"
                  step="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">원</span>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* 지출 내용 */}
            <div className="space-y-2">
              <Label htmlFor="title">지출 내용 *</Label>
              <Input
                id="title"
                placeholder="예: 스타벅스 커피"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
                maxLength={100}
              />
              {errors.title && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* 카테고리 선택 */}
            <div className="space-y-3">
              <Label>카테고리 *</Label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleInputChange('category', cat.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      formData.category === cat.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{cat.emoji}</div>
                    <div className="text-xs font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* 날짜 선택 */}
            <div className="space-y-2">
              <Label htmlFor="expenseDate">날짜 *</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => handleInputChange('expenseDate', e.target.value)}
                className={errors.expenseDate ? 'border-red-500' : ''}
              />
              {errors.expenseDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.expenseDate}
                </p>
              )}
            </div>

            {/* 분담 비율 */}
            <div className="space-y-3">
              <Label>분담 비율</Label>
              <div className="space-y-2">
                {SPLIT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('splitRatio', option.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      formData.splitRatio === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.description}</div>
                      </div>
                      {formData.splitRatio === option.value && (
                        <Check className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* 분담 금액 미리보기 */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-sm text-slate-600 mb-2">분담 금액</div>
                  <div className="flex justify-between">
                    <div>
                      <Badge variant="outline">내가 부담</Badge>
                      <div className="font-bold text-primary-600">{getMyShareAmount()}원</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">상대방 부담</Badge>
                      <div className="font-bold text-slate-600">{getPartnerShareAmount()}원</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 상세 설명 (선택사항) */}
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Input
                id="description"
                placeholder="예: 회사 근처 파스타 맛집"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={200}
              />
            </div>

            {/* 메모 (선택사항) */}
            <div className="space-y-2">
              <Label htmlFor="memo">메모</Label>
              <Textarea
                id="memo"
                placeholder="추가하고 싶은 내용이 있다면 적어주세요"
                value={formData.memo}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4 space-y-3">
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span>지출이 성공적으로 등록되었습니다!</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>지출 등록에 실패했습니다. 다시 시도해주세요.</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? '등록 중...' : '지출 등록하기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}