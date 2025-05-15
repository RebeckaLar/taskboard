export const Task = ({ task, handleComplete }) => {
  return (
    <div 
    className="p-4 shadow-sm bg-background rounded-lg cursor-pointer"
    onClick={() => handleComplete(task)}
    >
        <span className="text-xl font-medium">{task.title}</span>
    </div>
  )
}