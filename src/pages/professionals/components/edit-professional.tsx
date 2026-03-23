import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import type { IProfessional } from "@/types";
import { updateProfessional } from "@/services/professionalServices";
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
import { BiSolidEdit } from "react-icons/bi";
import ProfessionalForm from "./professional-form";

const EditProfessional = ({
  professional,
}: {
  professional: IProfessional;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["professional", professional._id],
      });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      setOpen(false);
      toast({
        title: "Professional Updated Successfully!",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: () => {
      toast({
        title: "Failed to update professional",
        variant: "destructive",
        description: moment().format("LL"),
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BiSolidEdit size="1.5rem" className="hover:cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Professional</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="h-[25rem] overflow-y-auto lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Edit Professional
          </DialogTitle>
        </DialogHeader>
        <ProfessionalForm
          professional={professional}
          submitFn={mutate}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessional;
