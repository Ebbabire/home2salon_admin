import { useState } from "react";

import { type Admin } from "../Admins";
import AdminForm from "./admin-form";

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
import { Edit } from "lucide-react";

export type EditAdminProp = {
  admin: Admin;
};

const EditAdmin = ({ admin }: EditAdminProp) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Edit size={"1rem"} className="hover:cursor-pointer" />
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
        <AdminForm admin={admin} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditAdmin;
