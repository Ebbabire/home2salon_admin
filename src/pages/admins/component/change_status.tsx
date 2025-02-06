import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";

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
import { changeAdminStatus } from "@/services/adminServices";
import Loading from "@/components/loader";
import { RiEdit2Fill } from "react-icons/ri";

type ChangeAdminStatusProps = {
  id: string;
  status: string;
};

const ChangeStatus = ({ id, status }: ChangeAdminStatusProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // query mutation logic to update admin data
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: changeAdminStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      setIsOpen(false);
      toast({
        title: "Admin Status Changed!",
        className: "bg-[#16432D] text-muted",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
    onError: () => {
      toast({
        title: "Admin Status Change Failed!",
        className: "text-muted",
        variant: "destructive",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
  });

  const handleChange: React.MouseEventHandler<HTMLButtonElement> | undefined = (
    e,
  ) => {
    e.preventDefault();
    const updatedStatus =
      status === "Active" ? { status: "Inactive" } : { status: "Active" };

    mutate({ ...updatedStatus, id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <RiEdit2Fill
                size={"1rem"}
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
              <span className="text-red-700">Deactivate admin!</span>
            ) : (
              <span>Activate admin!</span>
            )}{" "}
            <span>Are you absolutely sure?</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status === "Active" ? (
              <span>
                This action will remove the admin's access from the admin panel.
              </span>
            ) : (
              <span>
                This action will give this user access to the admin panel.
              </span>
            )}
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
            className={`${status === "Active" ? "bg-destructive hover:bg-destructive/80" : "bg-[#16432d] hover:bg-[#16432d]/80"}`}
          >
            {isLoading && (
              <span className="w-14">
                <Loading isLoading={isLoading} />
              </span>
            )}
            {error && !isLoading && <span>Retry</span>}
            {!isLoading && !error && <span>Continue</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeStatus;
