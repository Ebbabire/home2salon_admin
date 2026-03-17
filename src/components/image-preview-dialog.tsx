import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";

interface ImagePreviewDialogProps {
  src: string;
  alt?: string;
  trigger: React.ReactNode;
}

const ImagePreviewDialog = ({
  src,
  alt = "Preview",
  trigger,
}: ImagePreviewDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-h-[70vh] w-auto rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
