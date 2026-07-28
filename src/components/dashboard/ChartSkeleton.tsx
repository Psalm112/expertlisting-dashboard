/** Placeholder with the chart's exact footprint, so nothing shifts as it loads. */
export function ChartSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3" aria-hidden>
      <div className="flex items-start gap-2 pt-9">
        <div className="bg-surface-sunken mt-7 size-[18px] shrink-0 rounded-full" />

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="bg-surface-sunken/70 h-[143px] animate-pulse rounded-md" />
          <div className="h-[22px]" />
        </div>

        <div className="bg-surface-sunken mt-7 size-[18px] shrink-0 rounded-full" />
      </div>
    </div>
  );
}
