import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { addService } from "@/services/serviceServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm, { type ServiceFormValues } from "./service-form";

interface AddServiceProps {
  categoryId: string;
}

const AddService = ({ categoryId }: AddServiceProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", categoryId] });
      setOpen(false);
      toast({
        title: "Service Created",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: () => {
      toast({
        title: "Failed to create service",
        variant: "destructive",
        description: moment().format("LL"),
      });
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("price", String(values.price));
    fd.append("category", categoryId);
    if (values.description) fd.append("description", values.description);
    if (values.image?.[0]) fd.append("image", values.image[0]);
    mutate(fd);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Add New Service
          </DialogTitle>
        </DialogHeader>
        <ServiceForm
          onSubmit={handleSubmit}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
