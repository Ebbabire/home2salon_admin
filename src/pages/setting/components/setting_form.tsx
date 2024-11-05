import { useState } from "react";
import { z } from "zod";

import FormComp from "@/components/form/form-comp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSetting } from "@/services/settingServices";

const newSetting = [
  {
    type: "select",
    label: "Category",
    name: "category",
    placeholder: "Select price category",
    className: "col-span-2",
    options: [
      { name: "Product Box", value: "Product Box" },
      { name: "Buyer Subscription", value: "Buyer Subscription" },
      { name: "Referral Code", value: "Referral Code" },
    ],
  },
  {
    type: "select",
    label: "Type",
    name: "type",
    placeholder: "Select pricing type",
    className: "col-span-2",
    options: [
      { name: "Yearly", value: "Yearly" },
      { name: "Monthly", value: "Monthly" },
      { name: "One-Time", value: "One-Time" },
    ],
  },
  {
    type: "number",
    label: "Price",
    name: "price",
    placeholder: "Enter Price",
    className: "col-span-2",
  },
];

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  category: z.union([
    z.literal("Product Box"),
    z.literal("Buyer Subscription"),
    z.literal("Referral Code"),
  ]),
  type: z.union([
    z.literal("Monthly"),
    z.literal("Yearly"),
    z.literal("One-Time"),
  ]),
  price: z.string(),
});

const SettingForm = ({ setting }) => {
  const [error, setError] = useState("");
  // const { toast } = useToast();
  const defaultValues = {
    categroy: setting ? setting.categroy : "",
    type: setting ? setting.type : "",
    price: setting ? setting.price : "",
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addSetting,
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["price-plans"] });
    },
  });

  async function handleSubmit(values: FormValues) {
    const data = { ...values, price: parseInt(values.price) };
    console.log({ ...values, price: parseInt(values.price) });
    mutate(data);
  }
  return (
    <div>
      <FormComp
        formFields={newSetting}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        formSchema={formSchema}
        error=""
        isLoading={isPending}
      />
    </div>
  );
};

export default SettingForm;
