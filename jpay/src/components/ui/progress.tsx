import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const getVariantClasses = () => {
      switch (variant) {
        case 'success':
          return 'bg-success-500'
        case 'warning':
          return 'bg-warning-500'
        case 'danger':
          return 'bg-danger-500'
        default:
          return 'bg-primary-500'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-slate-100",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-in-out",
            getVariantClasses()
          )}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
          }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }