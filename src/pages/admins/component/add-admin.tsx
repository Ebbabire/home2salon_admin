import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminForm from "./admin-form";

const AddAdmin = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Admin</Button>
      </DialogTrigger>
      <DialogContent className="h-[25rem] overflow-y-auto lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Add New Admin
          </DialogTitle>
        </DialogHeader>
        <AdminForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddAdmin;
