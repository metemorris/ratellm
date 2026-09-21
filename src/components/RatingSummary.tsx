import { Stars } from "@/components/Stars";
import type { RatingSummary as RatingSummaryType } from "@/lib/reviews";

export function RatingSummary({ summary }: { summary: RatingSummaryType }) {
  const { count, average, histogram, dimensions } = summary;
  const total = histogram.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
      <div className="flex items-center gap-5 md:shrink-0">
        <span className="text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {average !== null ? average.toFixed(1) : "—"}
        </span>
        <div>
          <Stars value={average ?? 0} size={18} />
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {count} review{count === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const n = histogram[star - 1];
          const pct = total > 0 ? (n / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-6 shrink-0 text-right text-neutral-500 dark:text-neutral-400">
                {star}
              </span>
              <span className="text-star">★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-star"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-neutral-400 dark:text-neutral-500">
                {n}
              </span>
            </div>
          );
        })}
      </div>

      {dimensions.length > 0 ? (
        <div className="md:shrink-0">
          <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Rated by feature
          </h3>
          <div className="space-y-2">
            {dimensions.map((d) => (
              <div
                key={d.key}
                className="flex items-center justify-between gap-6 text-sm"
              >
                <span className="text-neutral-600 dark:text-neutral-300">
                  {d.label}
                </span>
                <span className="flex items-center gap-2">
                  <Stars value={d.average} size={13} />
                  <span className="w-7 text-right text-neutral-500 dark:text-neutral-400">
                    {d.average.toFixed(1)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
