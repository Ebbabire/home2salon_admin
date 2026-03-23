import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { getProfessionals } from "@/services/professionalServices";
import { assignProfessional } from "@/services/orderServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/components/loader";
import { cn } from "@/lib/utils";

interface Props {
  orderId: string;
}

const AssignProfessionalDialog = ({ orderId }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: professionals, isLoading: loadingPros } = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
    enabled: open,
  });

  const activeProfessionals = professionals?.filter(
    (p) => p.status === "Active",
  );

  const { mutate, isPending } = useMutation({
    mutationFn: assignProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setOpen(false);
      setSelectedId("");
      toast({
        title: "Professional Assigned",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Assignment Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleAssign = () => {
    if (!selectedId) return;
    mutate({ orderId, professionalId: selectedId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          Assign Professional
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Professional</DialogTitle>
        </DialogHeader>
        {loadingPros ? (
          <Loading isLoading />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="max-h-64 overflow-y-auto">
              {activeProfessionals?.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No active professionals available
                </p>
              )}
              {activeProfessionals?.map((pro) => (
                <div
                  key={pro._id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                    selectedId === pro._id &&
                      "bg-primary/10 font-medium text-primary",
                  )}
                  onClick={() => setSelectedId(pro._id ?? "")}
                >
                  <span className="capitalize">{pro.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    0{pro.phoneNumber}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="bg-primary hover:bg-primary/80"
              disabled={!selectedId || isPending}
              onClick={handleAssign}
            >
              {isPending ? (
                <span className="w-14">
                  <Loading isLoading={isPending} />
                </span>
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignProfessionalDialog;
