import { z } from "zod";

import FormComp from "@/components/form/form-comp";
import { adminFormFields } from "./form-data";
import { type AdminFormProps } from "./edit-admin";
import { slicePhoneNumber } from "@/pages/login/utils/validator";

type FormValues = z.infer<typeof formSchema>;

// form schema for adding admins
const formSchema = z.object({
  full_name: z.string().min(1),
  phone_number: z
    .string()
    .refine(
      (value) => /^(\+251|0)\d{9}$/.test(value),
      "Please enter a valid phone number",
    ),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
  role: z.union([z.literal("admin"), z.literal("superadmin")]),
});

// form schema when in editing mode
const editFormSchema = z.object({
  full_name: z.string().min(1),
  phone_number: z
    .string()
    .refine(
      (value) => /^(\+251|0)\d{9}$/.test(value),
      "Please enter a valid phone number",
    ),

  role: z.union([z.literal("admin"), z.literal("superadmin")]),
});

const AdminForm = ({ admin, submitFn, isPending, error }: AdminFormProps) => {
  // default values
  const defaultValues = {
    full_name: admin ? admin.full_name : "",
    phone_number: admin ? `${admin.phone_number}` : "",
    role: admin ? admin.role : "",
    password: "",
  };

  // form fields for the admin form (excludes the password field when in editing mode)
  const formFields = admin
    ? adminFormFields.filter((field) => field.type !== "password")
    : [...adminFormFields];

  // submit handler function
  function handleSubmit(values: FormValues) {
    // remove the "0" or "+251" from a phone number
    const phone_number = slicePhoneNumber(values.phone_number);

    // submit the data
    submitFn({ ...values, _id: admin?._id, phone_number : `+251${phone_number}` });
  }
  return (
    <div>
      <FormComp
        formFields={formFields}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        formSchema={admin ? editFormSchema : formSchema}
        error={error}
        isLoading={isPending}
        btn="Submit"
      />
    </div>
  );
};

export default AdminForm;
