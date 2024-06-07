import { z } from "zod";

import FormComp from "@/components/form/form-comp";
import { newAdminFormFields } from "./form-data";
import { type AdminFormProps } from "./edit-admin";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
  role: z.union([z.literal("Admin"), z.literal("Super Admin")]),
});

const AdminForm = ({ user }: AdminFormProps) => {
  const defaultValues = {
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    phoneNumber: user ? user.phoneNumber : "",
    email: user ? user.email : "",
    password: "",
    role: user ? user.role : "Admin",
  };

  const formFields = user
    ? newAdminFormFields.filter((field) => field.type !== "password")
    : [...newAdminFormFields];

  function handleSubmit(values: FormValues) {
    console.log(values);
  }
  return (
    <div>
      <FormComp
        formFields={formFields}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        formSchema={formSchema}
      />
    </div>
  );
};

export default AdminForm;
