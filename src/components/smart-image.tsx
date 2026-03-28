import { useMemo, useState } from "react"
import { ImageOff, RotateCcw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SmartImageProps {
  src?: string | null
  alt: string
  className?: string
  wrapperClassName?: string
  loading?: "lazy" | "eager"
  showRetry?: boolean
  fallbackText?: string
}

const SmartImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  loading = "lazy",
  showRetry = false,
  fallbackText = "Image unavailable",
}: SmartImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [reloadNonce, setReloadNonce] = useState(0)

  const effectiveSrc = useMemo(() => {
    if (!src) return ""
    if (reloadNonce === 0) return src
    const separator = src.includes("?") ? "&" : "?"
    return `${src}${separator}retry=${reloadNonce}`
  }, [src, reloadNonce])

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border bg-muted/30 text-xs text-muted-foreground",
          wrapperClassName
        )}
      >
        N/A
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 rounded-md bg-gray-300/60" />
      )}

      {!hasError ? (
        <img
          src={effectiveSrc}
          alt={alt}
          loading={loading}
          className={cn(
            "w-full transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(false)
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md border bg-muted/30 p-3 text-center">
          <ImageOff className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{fallbackText}</p>
          {showRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => {
                setHasError(false)
                setReloadNonce((prev) => prev + 1)
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SmartImage
