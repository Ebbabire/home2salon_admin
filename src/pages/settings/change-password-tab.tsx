import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/hooks/use-toast"
import { changeAdminPassword } from "@/services/adminServices"
import { clearSession } from "@/services/session"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loading from "@/components/loader"

const schema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type FormValues = z.infer<typeof schema>

export function ChangePasswordTab() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: changeAdminPassword,
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Please sign in again with your new password.",
        className: "bg-primary text-primary-foreground",
      })
      clearSession()
      navigate("/login", { replace: true })
    },
    onError: (err: Error) => {
      toast({
        title: "Could not change password",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = useCallback(
    (values: FormValues) => {
      mutate({
        current_password: values.current_password,
        new_password: values.new_password,
      })
    },
    [mutate],
  )

  return (
    <div className="space-y-6 p-1 pt-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Change your password
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          After saving, you&apos;ll be logged out and need to sign in again.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md space-y-4"
        >
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
