import type { IAdmin } from "../Admins";

import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateAdmin } from "@/services/adminServices";
import { useToast } from "@/components/hooks/use-toast";

import moment from "moment";

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
import AdminForm from "./admin-form";
import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";

export type AdminFormProps = {
  admin?: Omit<IAdmin, "status" | "password" | "id">;
  submitFn: UseMutateFunction<IAdmin, Error, IAdmin, unknown>;
  isPending: boolean;
  error: Error | null;
};

const EditAdmin = ({ admin }: { admin: IAdmin }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // state to control the dialog
  const [isOpen, setIsOpen] = useState(false);

  // query mutation logic to update admin data
  const { mutate, isPending, error } = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", admin._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      setIsOpen(false);
      toast({
        title: "Admin Edited Successfully!",
        className: "bg-[#16432D] text-muted",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
    onError: () => {
      toast({
        title: "Admin Edit Failed!",
        className: "text-muted",
        variant: "destructive",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BiSolidEdit size={"1.5rem"} className="hover:cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Admin</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="h-[25rem] overflow-y-auto lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Edit Admin
          </DialogTitle>
        </DialogHeader>
        <AdminForm
          admin={admin}
          submitFn={mutate}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAdmin;
