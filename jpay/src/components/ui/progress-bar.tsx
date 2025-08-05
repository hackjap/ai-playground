import * as React from "react"
import { Progress } from "./progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentAmount: number
  targetAmount: number
  className?: string
  showPercentage?: boolean
  showAmounts?: boolean
  onGoalAchieved?: () => void
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentAmount,
  targetAmount,
  className,
  showPercentage = true,
  showAmounts = true,
  onGoalAchieved
}) => {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100)
  const isCompleted = percentage >= 100
  const [wasCompleted, setWasCompleted] = React.useState(false)

  React.useEffect(() => {
    if (isCompleted && !wasCompleted && onGoalAchieved) {
      setWasCompleted(true)
      setTimeout(() => {
        onGoalAchieved()
      }, 300)
    }
  }, [isCompleted, wasCompleted, onGoalAchieved])
  
  const getVariant = () => {
    if (isCompleted) return 'success'
    if (percentage >= 80) return 'warning'
    return 'default'
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {showPercentage && (
          <span className={cn(
            "text-sm font-medium",
            isCompleted ? "text-green-600" : "text-gray-700"
          )}>
            {percentage.toFixed(1)}%
          </span>
        )}
        {showAmounts && (
          <span className="text-sm text-gray-500">
            {formatAmount(currentAmount)} / {formatAmount(targetAmount)}원
          </span>
        )}
      </div>
      <Progress 
        value={currentAmount} 
        max={targetAmount} 
        variant={getVariant()}
        className="h-3"
      />
      {isCompleted && (
        <div className="text-center">
          <span className="text-sm font-medium text-green-600">
            🎉 목표 달성 완료!
          </span>
        </div>
      )}
    </div>
  )
}

export { ProgressBar }