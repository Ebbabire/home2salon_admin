import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { addProfessional } from "@/services/professionalServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfessionalForm from "./professional-form";

const AddProfessional = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: addProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      setOpen(false);
      toast({
        title: "Professional Added Successfully!",
        className: "bg-[#16432D] text-muted",
        description: moment().format("LL"),
      });
    },
    onError: () => {
      toast({
        title: "Failed to add professional",
        variant: "destructive",
        description: moment().format("LL"),
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#276145] hover:bg-[#378b63]">
          Add Professional
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[25rem] overflow-y-auto lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Add New Professional
          </DialogTitle>
        </DialogHeader>
        <ProfessionalForm
          submitFn={mutate}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessional;
