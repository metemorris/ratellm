import Link from "next/link";
import type { HfSearchModel } from "@/lib/hf";
import { formatNumber } from "@/lib/format";
import { Stars } from "@/components/Stars";

type ModelCardProps = {
  model: HfSearchModel;
  rating?: { count: number; average: number };
};

export function ModelCard({ model, rating }: ModelCardProps) {
  const { count = 0, average = 0 } = rating ?? {};
  return (
    <Link
      href={`/models/${model.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
          <span className="truncate">{model.author ?? "unknown"}</span>
          {model.license ? <span>· {model.license}</span> : null}
        </div>
        <h3 className="mt-1 truncate text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {model.id}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        {count > 0 ? (
          <>
            <Stars value={average} size={14} />
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {average.toFixed(1)}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">
              ({count})
            </span>
          </>
        ) : (
          <span className="text-neutral-400 dark:text-neutral-500">
            No reviews yet
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        {model.pipelineTag ? (
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
            {model.pipelineTag.replace(/-/g, " ")}
          </span>
        ) : null}
        <span className="ml-auto whitespace-nowrap">
          {formatNumber(model.downloads)} downloads · {formatNumber(model.likes)}{" "}
          likes
        </span>
      </div>
    </Link>
  );
}
