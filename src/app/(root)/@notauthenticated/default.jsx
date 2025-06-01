import { Outfit } from 'next/font/google'
import { AuthFormView } from './_components/auth-form-view'

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700"],
  preload: true,
})

function AuthPage() {
  return (
    <div>
      <h2 className='text-center max-w-2xl text-4xl mx-auto my-20'>
        Welcome to <span className={outfit.className}>Taskboard</span>
      </h2>
      <AuthFormView />
    </div>
  )
}

export default AuthPage