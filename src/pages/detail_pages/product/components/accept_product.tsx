import { changeProdStatus } from "@/services/productServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import Loading from "@/components/loader";

const AcceptProduct = ({ prodId }: { prodId: string }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: changeProdStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#16432d] hover:bg-[#16432d]/80">Approve</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Confirm Product Approval
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="text-base">
            Are you sure you want to approve this product?
          </p>
        </DialogDescription>
        <div className="flex items-center gap-4">
          <Button
            className="bg-[#16432d] hover:bg-[#16432d]/80"
            onClick={() => mutate({ status: "Active", id, prodId })}
          >
            {isPending && !isError && <Loading isLoading={isPending} />}
            {!isPending && !isError && <span>Approve</span>}
            {isError && <p>{error.message}</p>}
          </Button>
          <Button variant={"destructive"}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptProduct;
