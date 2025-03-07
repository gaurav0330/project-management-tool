import { Skeleton } from "./Skeleton"

function SkeletonCard() {
  return (
    <div className="flex flex-col max-w-[500px] space-y-5 ml-5">
    <Skeleton className="h-[200px] w-[300px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[275px]" />
      <Skeleton className="h-4 w-[225px]" />
    </div>
  </div>
  )
}

export default SkeletonCard;