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
import { FormEvent } from "react";

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
}: {
  formSchema: any;
  defaultValues: any;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  formFields: FormFields;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { handleSubmit, setValue } = form;

  const handleFileInputChange = (e: FormEvent) => {
    console.log(e.target.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid w-full gap-x-4 gap-y-6 lg:grid-cols-3">
          {formFields?.map(
            ({ type, label, name, placeholder, className, options }) =>
              type === "select" ? (
                <FormField
                  key={label}
                  control={form.control}
                  name={name}
                  render={() => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <SelectInput
                          placeholder={placeholder ?? ""}
                          label={label}
                          value={form.getValues(name)}
                          setValue={setValue}
                          options={options ? options : []}
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
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          onChange={handleFileInputChange}
                          placeholder={placeholder}
                          type={type}
                          className={className}
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
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          type={type}
                          className={className}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ),
          )}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FormComp;
