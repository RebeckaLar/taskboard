import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"

export const TaskProgress = ({ total = 0, completed = 0, className, user, }) => {

    const progress = (completed / total ) * 100

  return (
    <div className={cn("", className)}>
        <div>
            <h2>{user.displayName}</h2>
            {/* Avatar */}
        </div>
        <div className="flex items-center justify-between mb-2">
            <span>{completed} / {total}</span>
            <span>{isNaN(progress.toFixed(0)) ? 0 : progress.toFixed(0)}%</span>
        </div>
        <Progress
        value={progress}
        className="h-4"
        />
    </div>
  )
}