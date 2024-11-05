import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAdmin, updateAdmin } from "@/services/adminServices";

import FormComp from "@/components/form/form-comp";
import { newAdminFormFields } from "./form-data";
import { type Admin } from "../Admins";
import { slicePhoneNumber } from "@/pages/login/utils/validator";

type FormValues = z.infer<typeof formSchema>;
type AdminFormProps = {
  admin?: Admin;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z
    .string()
    .refine(
      (value) => /^(\+251|0)\d{9}$/.test(value),
      "Please enter a valid phone number",
    ),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
  role: z.union([z.literal("Admin"), z.literal("Super Admin")]),
});

const editFormSchema = z.object({
  fullName: z.string(),
  phoneNumber: z
    .string()
    .refine(
      (value) => /^(\+251|0)\d{9}$/.test(value),
      "Please enter a valid phone number",
    ),
  email: z.string().email(),
  role: z.union([z.literal("Admin"), z.literal("Super Admin")]),
});

const AdminForm = ({ admin, setIsOpen }: AdminFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: admin ? updateAdmin : addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: admin ? ["admin"] : ["admins"],
      });
      setIsOpen(false);
    },
  });
  // const { toast } = useToast();
  const defaultValues = {
    fullName: admin ? admin.fullName : "",
    phoneNumber: admin ? admin.phoneNumber : "",
    email: admin ? admin.email : "",
    password: "",
    role: admin ? admin.role : "Admin",
  };

  const formFields = admin
    ? newAdminFormFields.filter((field) => field.type !== "password")
    : [...newAdminFormFields];

  async function handleSubmit(values: FormValues) {
    console.log(values);
    const phoneNumber = slicePhoneNumber(values.phoneNumber);

    if (admin) {
      mutate({ ...values, phoneNumber, _id: admin?._id });
    } else {
      mutate({ ...values, phoneNumber });
    }
  }
  return (
    <div>
      <FormComp
        isLoading={isPending}
        formFields={formFields}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        formSchema={admin ? editFormSchema : formSchema}
        error={error?.message ?? ""}
      />
    </div>
  );
};

export default AdminForm;
