import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import {
  getAppSettings,
  updateAppSettings,
} from "@/services/settingsServices"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loading from "@/components/loader"

const schema = z.object({
  advance_payment_percentage: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%"),
})

type FormValues = z.infer<typeof schema>

export function AdvancePaymentTab() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSettings,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      advance_payment_percentage: 0,
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        advance_payment_percentage: data.advance_payment_percentage,
      })
    }
  }, [data, form])

  const { mutate, isPending } = useMutation({
    mutationFn: updateAppSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appSettings"] })
      toast({
        title: "Settings saved",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Could not save settings",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = useCallback(
    (values: FormValues) => {
      mutate({
        advance_payment_percentage: values.advance_payment_percentage,
      })
    },
    [mutate],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading isLoading />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="py-6 text-sm text-destructive">
        {(error as Error).message}
      </p>
    )
  }

  return (
    <div className="space-y-6 p-1 pt-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Advance payment percentage
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Default percentage of the order total collected as advance payment for
          new bookings.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md space-y-4"
        >
          <FormField
            control={form.control}
            name="advance_payment_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Between 0 and 100.</FormDescription>
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
