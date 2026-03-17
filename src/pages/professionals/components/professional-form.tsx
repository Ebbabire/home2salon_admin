import { z } from "zod";
import FormComp from "@/components/form/form-comp";
import type { IProfessional } from "@/types";
import { slicePhoneNumber } from "@/pages/login/utils/validator";
import type { UseMutateFunction } from "@tanstack/react-query";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z
    .string()
    .refine(
      (v) => /^(\+251|0)\d{9}$/.test(v),
      "Please enter a valid phone number",
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const editFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z
    .string()
    .refine(
      (v) => /^(\+251|0)\d{9}$/.test(v),
      "Please enter a valid phone number",
    ),
});

const formFields = [
  {
    type: "text",
    label: "Full Name",
    name: "fullName",
    placeholder: "Enter Full Name",
    className: "col-span-2",
  },
  {
    type: "tel",
    label: "Phone Number",
    name: "phoneNumber",
    placeholder: "Enter Phone Number",
    className: "col-span-2",
  },
  {
    type: "password",
    label: "Password",
    name: "password",
    placeholder: "Enter Password",
    className: "col-span-2",
  },
];

export interface ProfessionalFormProps {
  professional?: IProfessional;
  submitFn: UseMutateFunction<IProfessional, Error, IProfessional, unknown>;
  isPending: boolean;
  error: Error | null;
}

const ProfessionalForm = ({
  professional,
  submitFn,
  isPending,
  error,
}: ProfessionalFormProps) => {
  const defaultValues = {
    fullName: professional?.fullName ?? "",
    phoneNumber: professional ? `0${professional.phoneNumber}` : "",
    password: "",
  };

  const fields = professional
    ? formFields.filter((f) => f.type !== "password")
    : [...formFields];

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const phoneNumber = slicePhoneNumber(values.phoneNumber);
    submitFn({
      ...values,
      _id: professional?._id,
      phoneNumber,
    } as IProfessional);
  }

  return (
    <FormComp
      formFields={fields}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      formSchema={professional ? editFormSchema : formSchema}
      error={error}
      isLoading={isPending}
      btn="Submit"
    />
  );
};

export default ProfessionalForm;
