import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import { addService } from "@/services/serviceServices"
import { uploadImageAndGetKey } from "@/services/uploadServices"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ServiceForm, { type ServiceFormValues } from "./service-form"

interface AddServiceProps {
  categoryId: string
}

const AddService = ({ categoryId }: AddServiceProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      const imageFile = values.image?.[0]
      const imageKey = imageFile
        ? await uploadImageAndGetKey(imageFile)
        : undefined

      return addService({
        name: values.name,
        price: values.price,
        commission_percentage: values.commission_percentage,
        category_id: categoryId,
        description: values.description,
        image_url: imageKey,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", categoryId] })
      setOpen(false)
      toast({
        title: "Service Created",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: () => {
      toast({
        title: "Failed to create service",
        variant: "destructive",
        description: moment().format("LL"),
      })
    },
  })

  const handleSubmit = (values: ServiceFormValues) => {
    mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">Add Service</Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] overflow-y-auto lg:max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b border-muted-foreground pb-4">
            Add New Servic
          </DialogTitle>
        </DialogHeader>
        <ServiceForm
          onSubmit={handleSubmit}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddService
