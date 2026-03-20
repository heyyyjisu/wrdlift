import Header from "@/components/header"
import { SignupForm } from "@/components/signupForm"

export default function SignupPage() {
  return (
    <>
      <Header />
      <div className="-mt-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </>
  )
}
