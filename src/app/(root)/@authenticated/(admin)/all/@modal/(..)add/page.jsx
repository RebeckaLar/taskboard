import { AddTaskForm } from "../../../add/_components/add-task-form"
import { Modal } from "./_components/modal"

//Send isModal to inform that this is not a pop up
function AddFormModalPage() {
  return (
    <Modal>
      <AddTaskForm isModal /> 
    </Modal>
  )
}
export default AddFormModalPage