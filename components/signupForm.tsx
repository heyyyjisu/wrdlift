"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Car } from "lucide-react"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState<string>("")
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const passwordIsInvalid =
    password && confirmPassword && password !== confirmPassword

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function onSignup(e: React.FormEvent<HTMLElement>) {
    e.preventDefault()
    setIsLoading(true)
    if (!email || !isValidEmail(email)) {
      setEmailInvalid(true)
    }
    if (!password || password.length < 8) {
      setPasswordInvalid(true)
    }
    if (password !== confirmPassword) {
      setPasswordInvalid(true)
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      router.push("/journal")
    } else {
      console.error("Error signing up")
    }
    setIsLoading(false)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSignup}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                value={email}
                onChange={(e) => {
                  {
                    setEmail(e.target.value)
                    if (emailInvalid) setEmailInvalid(false)
                  }
                }}
                id="email"
                type="text"
                placeholder="m@example.com"
                required
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                value={password}
                onChange={(e) => {
                  {
                    setPassword(e.target.value)
                    if (passwordInvalid) setPasswordInvalid(false)
                  }
                }}
                id="password"
                type="password"
                required
                disabled={isLoading}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                }}
                id="confirm-password"
                type="password"
                required
                disabled={isLoading}
              />
              {passwordIsInvalid ? (
                <p className="text-xs text-red-800">Password do not match.</p>
              ) : (
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner /> : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
