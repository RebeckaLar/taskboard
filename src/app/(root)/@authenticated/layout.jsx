import { Nav } from "@/components/nav"

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