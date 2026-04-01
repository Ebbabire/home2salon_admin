import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import type { IService } from "@/types";
import { updateService } from "@/services/serviceServices";
import { uploadImageAndGetKey } from "@/services/uploadServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";
import ServiceForm, { type ServiceFormValues } from "./service-form";

const EditService = ({ service }: { service: IService }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();


  const categoryId =
    typeof service.category_id === "string"
      ? service.category_id
      : service.category_id._id ?? "";

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      const imageFile = values.image?.[0];
      const imageKey = imageFile
        ? await uploadImageAndGetKey(imageFile)
        : service.image_url;

      return updateService(service._id ?? "", {
        name: values.name,
        price: values.price,
        commission_percentage: values.commission_percentage,
        category: categoryId,
        description: values.description,
        image_url: imageKey,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services", categoryId],
      });
      setOpen(false);
      toast({
        title: "Service Updated",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: () => {
      toast({
        title: "Failed to update service",
        variant: "destructive",
        description: moment().format("LL"),
      });
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded p-1 hover:bg-muted">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Edit Service
          </DialogTitle>
        </DialogHeader>
        <ServiceForm
          defaultValues={{
            name: service.name,
            price: service.price,
            commission_percentage: service.commission_percentage ?? 0,
            description: service.description,
          }}
          onSubmit={handleSubmit}
          isPending={isPending}
          error={error}
          isEdit
          existingImageUrl={service.image_url}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditService;
