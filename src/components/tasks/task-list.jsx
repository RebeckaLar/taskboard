import { Task } from "./task"

export const TaskList = ({ tasks, handleComplete }) => {
  return (
    <div className="space-y-3 w-full">
      {
      tasks.map(task => (
        <Task key={task.id} task={task}  handleComplete={handleComplete}/>
      ))
    }

    </div>
  )
}