import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { changeProfessionalStatus } from "@/services/professionalServices";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiEdit2Fill } from "react-icons/ri";
import Loading from "@/components/loader";

interface Props {
  id: string;
  status: string;
}

const ChangeProfessionalStatus = ({ id, status }: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: changeProfessionalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional", id] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      setOpen(false);
      toast({
        title: "Status Changed!",
        className: "bg-[#16432D] text-muted",
        description: moment().format("LL"),
      });
    },
    onError: () => {
      toast({
        title: "Status Change Failed!",
        variant: "destructive",
        description: moment().format("LL"),
      });
    },
  });

  const handleChange: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const next = status === "Active" ? "Inactive" : "Active";
    mutate({ id, status: next });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <RiEdit2Fill
                size="1rem"
                className={`${status === "Active" ? "text-red-600" : "text-green-500"} hover:cursor-pointer`}
              />
            </TooltipTrigger>
            <TooltipContent>
              {status === "Active" ? (
                <p className="text-red-700">Deactivate</p>
              ) : (
                <p>Activate</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === "Active" ? (
              <span className="text-red-700">Deactivate professional!</span>
            ) : (
              <span>Activate professional!</span>
            )}{" "}
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status === "Active"
              ? "This will remove the professional's access."
              : "This will grant the professional access."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {error && (
            <span className="mx-2 py-2 text-sm text-destructive">
              {error.message}
            </span>
          )}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleChange}
            className={
              status === "Active"
                ? "bg-destructive hover:bg-destructive/80"
                : "bg-[#16432d] hover:bg-[#16432d]/80"
            }
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : error ? (
              "Retry"
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeProfessionalStatus;
