import { type Admin } from "../Admins";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminForm from "./admin-form";

export type AdminFormProps = {
  user?: Omit<Admin, "status" | "password" | "status" | "id">;
};

const EditAdmin = ({ user }: { user: Admin | object }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-4 p-0 font-normal">
          Edit Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[25rem] overflow-y-auto lg:max-w-3xl">
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
