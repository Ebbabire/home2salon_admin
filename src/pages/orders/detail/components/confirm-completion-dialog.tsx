import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { confirmOrderCompletion } from "@/services/orderServices";
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
import { Button } from "@/components/ui/button";
import Loading from "@/components/loader";

interface Props {
  orderId: string;
}

const ConfirmCompletionDialog = ({ orderId }: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: confirmOrderCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setOpen(false);
      toast({
        title: "Order Completed!",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to complete order",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/80">
          Confirm Completion
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Order Completion?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the order as completed and credit the
            professional&apos;s wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {error && (
            <span className="mx-2 text-sm text-destructive">
              {error.message}
            </span>
          )}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary hover:bg-primary/80"
            onClick={(e) => {
              e.preventDefault();
              mutate(orderId);
            }}
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : (
              "Confirm"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmCompletionDialog;
