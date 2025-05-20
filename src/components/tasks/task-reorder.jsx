import { GripVerticalIcon } from "lucide-react"
import { Reorder } from "motion/react"
import { useState } from "react"

export const TaskReorder = ({ tasks, setTasks, movedTasks, accentColor }) => {

    const [active, setActive] = useState(null)

    const handleReorder = (list) => {

        //list is the updated task-list, after a task with temporary ("active") id was dragged
        const activeTask = list.find(t => t.id === active)
        const activeIndex = list.findIndex(t => t.id === active)
        const prev = list[activeIndex -1]?.order //previous task in the tasks array
        const next = list[activeIndex -1]?.order //next task in the tasks array

        const newOrder = getSparseOrder(prev, next)

        if(movedTasks.current.find(t => t.id === activeTask.id)) {
            const index = movedTasks.current.findIndex(t => t.id === activeTask.id)
            movedTasks.current[index].newOrder = newOrder
        } else {
            movedTasks.current,push({ id: activeTask.id, newOrder })
        }

        setTasks(list)
    }

    console.log(movedTasks)

    const getSparseOrder = (prev, next) => {
        if(prev === undefined) return next -1000
        if(next === undefined) return prev + 1000

        return prev + Math.floor(( next-prev ) / 2)
    }

  return (
    <div>
        <Reorder.Group
        axis="y"
        as="ul"
        values={tasks}
        onReorder={handleReorder}
        className="space-y-3 w-full"
        >
            {
                tasks.map(task => (
                    <Reorder.Item
                        as="li"
                        key={task.id} //Targeting the tasks id
                        onDragStart={() => setActive(task.id)} // Add temporary id to the task thats being dragged. Listening to the temporary id.
                        onDragEnd={() => setActive(null)} //Remove temporary id when user stops dragging the task
                        value={task}
                        className="flex items-center gap-3 p-4 shadow-sm bg-background rounded-lg cursor-pointer"
                        style={{ backgroundColor: accentColor }}

                    >
                        <GripVerticalIcon className="size-5"/>
                        <span className="text-xl font-medium">{task.title}</span>
                    </Reorder.Item>
                ))
            }

        </Reorder.Group>
    </div>
  )
}