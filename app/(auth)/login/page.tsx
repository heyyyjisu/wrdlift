import Header from "@/components/header"
import { LoginForm } from "@/components/loginForm"

export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="-mt-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
