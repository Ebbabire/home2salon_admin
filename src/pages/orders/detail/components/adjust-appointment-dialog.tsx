import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import moment from "moment";
import { adjustAppointment } from "@/services/orderServices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loader";

interface Props {
  orderId: string;
  currentDate: string;
  currentTime: string;
}

const AdjustAppointmentDialog = ({
  orderId,
  currentDate,
  currentTime,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    moment(currentDate).format("YYYY-MM-DD"),
  );
  const [time, setTime] = useState(currentTime);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: adjustAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setOpen(false);
      toast({
        title: "Appointment Adjusted",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to adjust appointment",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ orderId, scheduledDate: date, scheduledTime: time });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Adjust Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80"
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-14">
                <Loading isLoading={isPending} />
              </span>
            ) : (
              "Update Schedule"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustAppointmentDialog;
