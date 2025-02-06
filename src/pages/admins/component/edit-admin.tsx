import { type Admin } from "../Admins";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AdminForm from "./admin-form";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";

export type AdminFormProps = Omit<
  Admin,
  "status" | "password" | "status" | "id"
>;

const EditAdmin = ({ user }: { user: Admin | object }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Edit size={"1rem"} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Admin</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="h-[25rem] max-w-[80%] overflow-y-auto rounded-md md:max-w-[70%] lg:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Edit Admin
          </DialogTitle>
        </DialogHeader>
        <AdminForm user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default EditAdmin;
