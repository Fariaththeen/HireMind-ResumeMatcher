import * as React from "react"
import { cn } from "../../lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const getColorClass = (percentage: number) => {
      if (percentage >= 80) return "bg-green-500"
      if (percentage >= 60) return "bg-blue-500"
      if (percentage >= 40) return "bg-yellow-500"
      return "bg-red-500"
    }

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "h-4 w-full overflow-hidden rounded-full bg-gray-200",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-in-out rounded-full",
              getColorClass(percentage)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
