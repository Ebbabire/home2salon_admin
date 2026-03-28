export function AssignDialogLoading() {
  return (
    <div className="grid min-h-[360px] grid-cols-1 gap-4 p-6 sm:grid-cols-[220px_1fr]">
      <div className="space-y-2 border-r border-transparent pr-2 sm:border-border">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-muted/60" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/40" />
        ))}
      </div>
    </div>
  )
}
