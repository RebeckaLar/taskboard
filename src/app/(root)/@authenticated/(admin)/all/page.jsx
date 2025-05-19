import { Header } from "@/components/header"
import { AllUsersTasksList } from "./_components/all-users-tasks-list"

function AllTaskPage() {
  return (
    <>
      <Header />
      <div className="mt-10 flex gap-4 overflow-x-auto pb-20">
        ALL
        <AllUsersTasksList />
      </div>
    </>
  )
}
export default AllTaskPage