import { Button } from "@/components/ui/button"
import Link from "next/link"

function NotFound() {
  return (
    <div className="mt-[35svh] flex flex-col gap-8 items-center">
        <h1 className="text-2xl md:text-3xl text-center font-bold">404 - Could not find page you were looking for</h1>
        <Button asChild>
            <Link href="/" replace>Back to starting page</Link>
        </Button>
    </div>
  )
}
export default NotFound