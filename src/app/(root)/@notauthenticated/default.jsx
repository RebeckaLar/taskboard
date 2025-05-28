import { Poppins } from 'next/font/google'
import { AuthFormView } from './_components/auth-form-view'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"]
})

function AuthPage() {
  return (
    <div>
      <h2 className='text-center max-w-2xl text-4xl mx-auto my-20'>
        Welcome to <span className={poppins.className}>Taskboard</span>
      </h2>
      <AuthFormView />
    </div>
  )
}

export default AuthPage