import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import SelectInput, { OptionPorp } from "../select-input";
import { Textarea } from "../ui/textarea";
import Loading from "../loader";

type FormObj = {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  options?: OptionPorp;
};

type FormFields = FormObj[];

const FormComp = ({
  formSchema,
  defaultValues,
  onSubmit,
  formFields,
  isLoading,
  error,
}: {
  formSchema: any;
  defaultValues: any;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  formFields: FormFields;
  error: string;
  isLoading: boolean;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { handleSubmit, setValue, /*formState,*/ register } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid w-full gap-x-4 gap-y-6 lg:grid-cols-6">
          {/* {console.log(formState.errors)} */}
          {formFields?.map(
            ({ type, label, name, placeholder, className, options }) =>
              type === "select" ? (
                <FormField
                  key={label}
                  control={form.control}
                  name={name}
                  render={() => (
                    <FormItem className={className}>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <SelectInput
                          placeholder={placeholder ?? ""}
                          label={label}
                          name={name}
                          value={form.getValues(name)}
                          setValue={setValue}
                          options={options ? options : []}
                          className={className ? className : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "file" ? (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={() => (
                    <FormItem className={className}>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          type={type}
                          className={className}
                          {...register(name)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "textArea" ? (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className={className}>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className={className}>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          type={type}
                          {...field}
                          maxLength={
                            type === "tel"
                              ? form.getValues(name) &&
                                form.getValues(name)[0] === "0"
                                ? 10
                                : 13
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              ),
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end">
          {error && (
            <span className="mx-2 py-2 text-sm text-destructive">{error}</span>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <span className="w-14">
                <Loading isLoading={isLoading} />
              </span>
            )}
            {error && !isLoading && <span>Retry</span>}
            {!isLoading && !error && <span>Submit</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComp;
