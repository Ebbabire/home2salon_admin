import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  slicePhoneNumber,
  validatePass,
  validatePhone,
} from "./utils/validator"
import { login } from "@/services/adminServices"
import Loading from "@/components/loader"
import logo from "@/assets/logo.png"

export type Login = {
  password: string
  phoneNumber: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  })

  const [isValid, setIsValid] = useState({
    isPassValid: true,
    isPhoneNumValid: true,
  })

  const { isPhoneNumValid, isPassValid } = isValid
  const { phoneNumber, password } = loginData

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target

    if (name === "phoneNumber") {
      if (value.length > 13) {
        setError(`Phone number cannot exceed 13 digits.`)
      }
    }

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === "phoneNumber") {
      setIsValid((prevState) => ({
        ...prevState,
        isPhoneNumValid: validatePhone(value),
      }))
    } else if (name === "password") {
      setIsValid((prevState) => ({
        ...prevState,
        isPassValid: validatePass(value),
      }))
    }
  }
  const handlePhoneNumBlur = () => {
    setIsValid((prevState) => ({
      ...prevState,
      isPhoneNumValid: validatePhone(phoneNumber),
    }))
  }

  const handlePassBlur = () => {
    setIsValid((prevState) => ({
      ...prevState,
      isPassValid: validatePass(password),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isPassValid || !isPhoneNumValid) return

    const phoneNum = slicePhoneNumber(loginData.phoneNumber)

    setIsLoading(true)
    try {
      await login({
        phone_number: `+251${phoneNum}`,
        password: loginData.password,
      })
      navigate("/")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-screen">
      <div className="hidden flex-col items-center justify-center gap-8 bg-primary/90 px-12 text-primary-foreground lg:flex lg:w-1/2">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-24 items-center justify-center rounded-2xl text-xl font-bold backdrop-blur-sm">
            <img src={logo} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Home2Salon</h1>
          <p className="text-lg font-medium text-primary-foreground/70">
            Admin Panel
          </p>
        </div>
        <p className="max-w-sm text-center text-sm leading-relaxed text-primary-foreground/50">
          Manage services, professionals, and orders — all from one dashboard.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1.5">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Enter your <span className="font-medium">Phone Number</span> and
                <span className="font-medium"> Password</span> below to login to
                your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="09xxxxxxxx"
                  onChange={handleInputChange}
                  onBlur={handlePhoneNumBlur}
                  maxLength={
                    loginData.phoneNumber && loginData.phoneNumber[0] === "0"
                      ? 10
                      : 13
                  }
                  required
                />
                {!isPhoneNumValid && (
                  <span className="text-xs text-red-500">
                    Please enter a valid phone number!
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  onBlur={handlePassBlur}
                  required
                />
                {!isPassValid && (
                  <span className="text-xs text-red-500">
                    Please enter a valid password, should be between 6 and 14
                    characters!
                  </span>
                )}
                <Link
                  to="/pass-reset"
                  className="ml-auto inline-block text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-1">
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <span className="w-14">
                    <Loading isLoading={isLoading} />
                  </span>
                )}
                {!isLoading && error !== "" && <span>Retry</span>}
                {!isLoading && error === "" && <span>Login</span>}
              </Button>
              {!isLoading && error !== "" && (
                <span className="text-sm text-red-500">{error}</span>
              )}
              <div className="mt-5 text-xs">
                <span>Powered By </span>
                <a
                  href="https://www.qemertech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground"
                >
                  Qemer Software Technology
                </a>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
