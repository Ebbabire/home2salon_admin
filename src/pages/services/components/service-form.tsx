import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loader";
import SmartImage from "@/components/smart-image";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  commission_percentage: z.coerce
    .number()
    .min(0, "Commission must be >= 0")
    .max(100, "Commission must be <= 100"),
  description: z.string().optional(),
  image: z.instanceof(FileList).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => void;
  isPending: boolean;
  error: Error | null;
  isEdit?: boolean;
  existingImageUrl?: string;
}

const ServiceForm = ({
  defaultValues,
  onSubmit,
  isPending,
  error,
  isEdit,
  existingImageUrl,
}: ServiceFormProps) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      price: defaultValues?.price ?? 0,
      commission_percentage: defaultValues?.commission_percentage ?? 0,
      description: defaultValues?.description ?? "",
    },
  });

  const selectedFile = form.watch("image")?.[0];
  const selectedPreviewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(
    () => () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    },
    [selectedPreviewUrl],
  );

  const previewUrl =
    selectedPreviewUrl ??
    (existingImageUrl
      ? `${import.meta.env.VITE_BASE_URL}/users/get-images/?name=${existingImageUrl}`
      : null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter service name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (ETB)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  min={0}
                  max={100}
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Brief description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...rest}
                  value={undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewUrl ? (
          <div className="overflow-hidden rounded-md border">
            <SmartImage
              src={previewUrl}
              alt="Service preview"
              loading="eager"
              showRetry
              wrapperClassName="h-40 w-full rounded-md"
              className="h-40 w-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          {error && (
            <span className="text-sm text-destructive">{error.message}</span>
          )}
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={isPending}
          >
            {isPending ? (
                <Loading isLoading={isPending} width="w-14" />
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
