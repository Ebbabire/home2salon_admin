import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useState } from "react"
import SmartImage from "./smart-image"

interface ImagePreviewDialogProps {
  src: string
  alt?: string
  trigger: React.ReactNode
}

const ImagePreviewDialog = ({
  src,
  alt = "Preview",
  trigger,
}: ImagePreviewDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <SmartImage
            src={src}
            alt={alt}
            loading="eager"
            showRetry
            wrapperClassName="aspect-[4/3] w-full max-w-[90vw] rounded-md bg-muted/20"
            className="h-full w-full rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImagePreviewDialog
