import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { IProfessional } from "@/types"
import type { UseMutateFunction } from "@tanstack/react-query"
import { slicePhoneNumber } from "@/pages/login/utils/validator"
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
import SkillsPicker from "./skills-picker"

const baseSchema = {
  full_name: z.string().min(1, "Full name is required"),
  phone_number: z
    .string()
    .refine(
      (v) => /^(\+251|0)\d{9}$/.test(v),
      "Please enter a valid phone number"
    ),
  skills: z.array(z.string()).default([]),
}

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const editSchema = z.object(baseSchema)

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>
type FormValues = CreateValues | EditValues

export interface ProfessionalFormProps {
  professional?: IProfessional
  submitFn: UseMutateFunction<
    IProfessional,
    Error,
    Pick<IProfessional, "password" | "full_name" | "phone_number" | "_id"> & {
      skills: string[]
    },
    unknown
  >
  isPending: boolean
  error: Error | null
}

const ProfessionalForm = ({
  professional,
  submitFn,
  isPending,
  error,
}: ProfessionalFormProps) => {
  const isEdit = !!professional
  const schema = isEdit ? editSchema : createSchema

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: professional?.full_name ?? "",
      phone_number: professional ? `${professional.phone_number}` : "",
      skills:
        professional?.skills
          ?.map((skill) =>
            typeof skill === "string" ? skill : skill._id ?? ""
          )
          .filter(Boolean) ?? [],
      ...(isEdit ? {} : { password: "" }),
    },
  })

  function onSubmit(values: FormValues) {
    const phone_number = slicePhoneNumber(values.phone_number)
    submitFn({
      ...values,
      _id: professional?._id,
      phone_number: `+251${phone_number}`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid w-full gap-x-4 gap-y-6 lg:grid-cols-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter Phone Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEdit && (
            <FormField
              control={form.control}
              name={"password" as keyof FormValues}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                      value={(field.value as string) ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <SkillsPicker
                    value={(field.value as string[]) ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end">
          {error && (
            <span className="mx-2 py-2 text-sm text-destructive">
              {error.message}
            </span>
          )}

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={isPending}
          >
            {isPending && (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            )}
            {error && !isPending && <span>Retry</span>}
            {!isPending && !error && <span>Submit</span>}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfessionalForm
