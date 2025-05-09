import { Nav } from "@/components/nav"
import Providers from "@/components/providers"

function Layout({ children }) {
  return (
    <>
      <Nav /> 
        <main>
            { children }
        </main>
    </>
  )
}
export default Layout