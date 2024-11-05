import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RejectProduct = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Reject</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Confirm Product Rejection
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="text-base">
            Are you sure you want to reject this product?
          </p>
        </DialogDescription>
        <div className="flex items-center gap-4">
          <Button variant={"destructive"}>Reject</Button>
          <Button variant={"outline"}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectProduct;
