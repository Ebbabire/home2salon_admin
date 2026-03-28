import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminForm from "./admin-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { addAdmin } from "@/services/adminServices";

const AddAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // state to control the dialog
  const [isOpen, setIsOpen] = useState(false);

  // query mutation logic to update admin data
  const { mutate, isPending, error } = useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      setIsOpen(false);
      toast({
        title: "Admin Added Successfully!",
        className: "bg-primary text-primary-foreground",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
    onError: () => {
      toast({
        title: "Admin Add Failed!",
        className: "text-muted",
        variant: "destructive",
        description: `${moment(new Date()).format("LL")}`,
      });
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">Add Admin</Button>
      </DialogTrigger>
      <DialogContent className="h-[22rem] overflow-y-auto lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Add New Admin
          </DialogTitle>
        </DialogHeader>
        <AdminForm submitFn={mutate} isPending={isPending} error={error} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAdmin;
