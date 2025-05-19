import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"
import { TaskSettingsDialog } from "./task-settings-dialog"

export const TaskProgress = ({ total = 0, completed = 0, className, user, }) => {

    const progress = (completed / total ) * 100

  return (
    <div className={cn("", className)}>
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            <TaskSettingsDialog user={user}/>
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