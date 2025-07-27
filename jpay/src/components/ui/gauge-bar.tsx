import { cn } from '@/lib/utils'

interface GaugeBarProps {
  value: number // 0-100 percentage
  maxValue?: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showPercentage?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
}

export function GaugeBar({
  value,
  maxValue = 100,
  label,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  className,
}: GaugeBarProps) {
  // Ensure value is between 0 and maxValue
  const clampedValue = Math.max(0, Math.min(value, maxValue))
  const percentage = (clampedValue / maxValue) * 100

  // Auto-determine variant based on percentage if variant is default
  const getVariant = () => {
    if (variant !== 'default') return variant
    if (percentage >= 100) return 'danger'
    if (percentage >= 80) return 'warning'
    if (percentage >= 60) return 'success'
    return 'default'
  }

  const currentVariant = getVariant()

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'text-sm font-medium',
              currentVariant === 'danger' && 'text-red-600',
              currentVariant === 'warning' && 'text-yellow-600',
              currentVariant === 'success' && 'text-green-600',
              currentVariant === 'default' && 'text-primary'
            )}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[currentVariant]
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

// 별도 컴포넌트로 예산 진행률 표시
interface BudgetProgressProps {
  spent: number
  budget: number
  alertThreshold?: number
  className?: string
}

export function BudgetProgress({ 
  spent, 
  budget, 
  alertThreshold = 80,
  className 
}: BudgetProgressProps) {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0
  const isOverBudget = percentage >= 100
  const isNearAlert = percentage >= alertThreshold

  const getVariant = (): 'default' | 'success' | 'warning' | 'danger' => {
    if (isOverBudget) return 'danger'
    if (isNearAlert) return 'warning' 
    return 'success'
  }

  const getStatusText = () => {
    if (isOverBudget) {
      return `예산 초과 (${Math.round(percentage - 100)}% 초과)`
    }
    if (isNearAlert) {
      return `주의 필요 (알림 기준 ${alertThreshold}% 도달)`
    }
    return '안전한 수준'
  }

  return (
    <div className={className}>
      <GaugeBar
        value={spent}
        maxValue={budget}
        variant={getVariant()}
        size="lg"
        showPercentage={true}
      />
      <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
        <span>{getStatusText()}</span>
        <span>
          남은 예산: {budget > spent ? `₩${(budget - spent).toLocaleString()}` : '예산 초과'}
        </span>
      </div>
    </div>
  )
}