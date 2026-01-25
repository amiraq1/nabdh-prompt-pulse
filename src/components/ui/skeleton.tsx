import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    />
  );
}

// Prompt Card Skeleton
function PromptCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 sm:p-5 animate-fade-in min-h-[280px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>

      {/* Content */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}

// Table Row Skeleton
function TableRowSkeleton() {
  return (
    <tr className="border-border">
      <td className="p-4"><Skeleton className="h-5 w-40" /></td>
      <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
      <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
      <td className="p-4 hidden md:table-cell">
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
}

// Stats Card Skeleton
function StatsCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export {
  Skeleton,
  PromptCardSkeleton,
  TableRowSkeleton,
  StatsCardSkeleton,
};

