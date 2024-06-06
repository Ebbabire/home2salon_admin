import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import {
  slicePhoneNumber,
  validatePass,
  validatePhone,
} from "./utils/validator";
import { ModeToggle } from "@/components/mood-toggle";

export type Login = {
  password: string;
  phoneNumber: string;
};

export function LoginForm() {
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [isValid, setIsValid] = useState({
    isPassValid: true,
    isPhoneNumValid: true,
  });

  const { isPhoneNumValid, isPassValid } = isValid;
  const { phoneNumber, password } = loginData;

  const handleInputChange = (e: FormEvent) => {
    const { name, value } = e.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "phoneNumber" && !isPhoneNumValid) {
      setIsValid((prevState) => ({
        ...prevState,
        isPhoneNumValid: validatePhone(value),
      }));
    }
    if (name === "password" && !isPassValid) {
      setIsValid((prevState) => ({
        ...prevState,
        isPassValid: validatePass(value),
      }));
    }
  };
  const handlePhoneNumBlur = () => {
    setIsValid((prevState) => ({
      ...prevState,
      isPhoneNumValid: validatePhone(phoneNumber),
    }));
  };

  const handlePassBlur = () => {
    setIsValid((prevState) => ({
      ...prevState,
      isPassValid: validatePass(password),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isPassValid || !isPhoneNumValid) return;

    const phoneNum = slicePhoneNumber(loginData.phoneNumber);
    console.log({ phoneNumber: phoneNum, password: loginData.password });
  };

  return (
    <>
      <div className="flex justify-end mx-12 my-2">
        <ModeToggle />
      </div>
      <div className="flex h-screen items-center justify-center">
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-sm dark:border-white/50">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
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
                  required
                />
                {!isPhoneNumValid && (
                  <span className="text-red-500 text-xs">
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
                  <span className="text-red-500 text-xs">
                    Please enter a valid password, should be between 6 and 14
                    character!
                  </span>
                )}
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
