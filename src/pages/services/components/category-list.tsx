import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/hooks/use-toast"
import moment from "moment"
import type { ICategory } from "@/types"
import {
  deleteCategory,
  addCategory,
  updateCategory,
} from "@/services/categoryServices"
import { uploadImageAndGetKey } from "@/services/uploadServices"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Loading from "@/components/loader"
import SmartImage from "@/components/smart-image"

const resolveImageSrc = (value?: string) => {
  if (!value) return null
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  return `${import.meta.env.VITE_BASE_URL}/users/get-images/?name=${value}`
}

interface CategoryListProps {
  categories: ICategory[]
  selectedId: string
  onSelect: (id: string) => void
}

const CategoryList = ({
  categories,
  selectedId,
  onSelect,
}: CategoryListProps) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const selectedPreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  )

  useEffect(
    () => () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl)
    },
    [selectedPreviewUrl]
  )

  const addMutation = useMutation({
    mutationFn: async (payload: { name: string; image_url?: string }) =>
      addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesPaginated"] })
      setDialogOpen(false)
      setName("")
      setIsUploadingImage(false)
      toast({
        title: "Category Created",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create category",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: { name: string; image_url?: string }
    }) => updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesPaginated"] })
      setDialogOpen(false)
      setEditingCategory(null)
      setName("")
      setImageFile(null)
      setIsUploadingImage(false)
      toast({
        title: "Category Updated",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update category",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      if (selectedId) onSelect("")
      toast({
        title: "Category Deleted",
        className: "bg-primary text-primary-foreground",
        description: moment().format("LL"),
      })
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to delete category",
        description: err.message,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isUploadingImage) return
    if (editingCategory && !editingCategory._id) return
    const execute = async () => {
      setIsUploadingImage(true)
      const imageKey = imageFile
        ? await uploadImageAndGetKey(imageFile)
        : editingCategory?.image_url

      const payload = { name: name.trim(), image_url: imageKey }
      if (editingCategory) {
        updateMutation.mutate({ id: editingCategory._id!, payload })
      } else {
        addMutation.mutate(payload)
      }
    }

    void execute().catch((err: Error) => {
      setIsUploadingImage(false)
      toast({
        title: editingCategory
          ? "Failed to update category"
          : "Failed to create category",
        description: err.message,
        variant: "destructive",
      })
    })
  }

  const openEdit = (cat: ICategory) => {
    setEditingCategory(cat)
    setName(cat.name)
    setImageFile(null)
    setDialogOpen(true)
  }

  const openAdd = () => {
    setEditingCategory(null)
    setName("")
    setImageFile(null)
    setDialogOpen(true)
  }

  const isPending = addMutation.isPending || updateMutation.isPending
  const isSubmitting = isPending || isUploadingImage

  return (
    <div className="w-56 shrink-0 border-r pr-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Categories</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={openAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                disabled={isSubmitting}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                disabled={isSubmitting}
              />
              {(selectedPreviewUrl || editingCategory?.image_url) && (
                <div className="overflow-hidden rounded-md border">
                  <SmartImage
                    src={
                      selectedPreviewUrl ??
                      resolveImageSrc(editingCategory?.image_url) ??
                      undefined
                    }
                    alt="Category preview"
                    loading="eager"
                    showRetry
                    wrapperClassName="h-32 w-full rounded-md"
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/80"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loading isLoading={isSubmitting} width="w-14" />
                ) : editingCategory ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-1">
        {categories.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No categories yet
          </p>
        )}
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={cn(
              "group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
              selectedId === cat._id && "bg-muted font-medium text-primary"
            )}
            onClick={() => onSelect(cat._id ?? "")}
          >
            <div className="flex min-w-0 items-center gap-2">
              <SmartImage
                src={resolveImageSrc(cat.image_url)}
                alt={cat.name}
                wrapperClassName="h-7 w-7 rounded"
                className="h-7 w-7 rounded object-cover"
              />
              <span className="truncate capitalize">{cat.name}</span>
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="rounded p-0.5 hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation()
                  openEdit(cat)
                }}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="rounded p-0.5 hover:bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete category?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{cat.name}&quot; and
                      may affect associated services.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/80"
                      onClick={() => deleteMutation.mutate(cat._id ?? "")}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
