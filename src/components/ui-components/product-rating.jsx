import { Star } from "lucide-react"
import { cn } from "@/lib/utils"


export function ProductRating({ rating, reviews, showCount = true, size = "md", className }) {
  // Size-specific classes
  const sizeClasses = {
    sm: {
      container: "gap-0.5",
      star: "h-3 w-3",
      text: "text-xs",
    },
    md: {
      container: "gap-1",
      star: "h-4 w-4",
      text: "text-sm",
    },
    lg: {
      container: "gap-1.5",
      star: "h-5 w-5",
      text: "text-base",
    },
  }

  // Provide default values for rating and reviews
  const safeRating = rating || 0
  const safeReviews = reviews || 0

  return (
    <div className={cn("flex items-center", sizeClasses[size].container, className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size].star,
              star <= Math.round(safeRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
            )}
          />
        ))}
      </div>

      <span className={cn("font-medium", sizeClasses[size].text)}>{safeRating.toFixed(1)}</span>

      {showCount && safeReviews !== undefined && (
        <>
          <span className="mx-1 text-muted-foreground">•</span>
          <span className={cn("text-muted-foreground", sizeClasses[size].text)}>
            {safeReviews} {safeReviews === 1 ? "review" : "reviews"}
          </span>
        </>
      )}
    </div>
  )
}