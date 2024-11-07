import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema, infer as ZodInfer } from "zod";

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

interface FormCompProps {
  formSchema: ZodSchema;
  defaultValues?: ZodInfer<ZodSchema>;
  onSubmit: (values: ZodInfer<ZodSchema>) => void;
  formFields: FormFields;
  error: Error | null;
  btn: string;
  btnWidth?: string;
  isLoading: boolean;
}

const FormComp = ({
  formSchema,
  defaultValues,
  onSubmit,
  formFields,
  error,
  isLoading,
  btn,
  btnWidth,
}: FormCompProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { handleSubmit, setValue } = form;

  const handleFileInputChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = (e) => {
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

        <div className="flex flex-wrap items-center justify-end">
          {error && (
            <span className="mx-2 py-2 text-sm text-destructive">
              {error.message}
            </span>
          )}

          <Button
            type="submit"
            className={`${btnWidth} bg-[#16432d] hover:bg-[#16432d]/80`}
            disabled={isLoading}
          >
            {isLoading && (
              <span className="w-14">
                <Loading isLoading={isLoading} />
              </span>
            )}
            {error && !isLoading && <span>Retry</span>}
            {!isLoading && !error && <span>{btn}</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComp;
