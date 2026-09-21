import { Stars } from "@/components/Stars";
import { formatDate } from "@/lib/format";
import {
  CONTEXTS,
  DEPLOYMENTS,
  DIMENSIONS,
  PROJECT_TYPES,
  USE_CASES,
  labelFor,
  labelsFor,
  parseDimensions,
  parseJsonArray,
} from "@/lib/survey";

export type ReviewData = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  author: string | null;
  useCase: string;
  contexts: string;
  dimensions: string;
  deployment: string | null;
  hardware: string | null;
  projectType: string | null;
  createdAt: Date;
};

export function ReviewItem({ review }: { review: ReviewData }) {
  const contexts = labelsFor(CONTEXTS, parseJsonArray(review.contexts));
  const dimensions = parseDimensions(review.dimensions);
  const deploymentLabel = review.deployment
    ? labelFor(DEPLOYMENTS, review.deployment)
    : null;
  const projectTypeLabel = review.projectType
    ? labelFor(PROJECT_TYPES, review.projectType)
    : null;
  const hasDimensions = DIMENSIONS.some((d) => dimensions[d.key]);

  return (
    <li className="border-b border-neutral-200 py-6 last:border-b-0 dark:border-neutral-800">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {review.author ?? "Anonymous"}
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">·</span>
        <span className="text-neutral-400 dark:text-neutral-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Stars value={review.rating} size={15} />
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {review.rating.toFixed(1)}
          </span>
        </span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {labelFor(USE_CASES, review.useCase)}
        </span>
        {deploymentLabel ? (
          <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            {deploymentLabel}
          </span>
        ) : null}
        {projectTypeLabel ? (
          <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            {projectTypeLabel}
          </span>
        ) : null}
        {review.hardware ? (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            on {review.hardware}
          </span>
        ) : null}
      </div>

      {review.title ? (
        <h3 className="mt-2.5 text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {review.title}
        </h3>
      ) : null}

      <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        {review.body}
      </p>

      {hasDimensions ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          {DIMENSIONS.map((d) => {
            const value = dimensions[d.key];
            if (!value) return null;
            return (
              <span
                key={d.key}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
              >
                <span className="text-neutral-400 dark:text-neutral-500">
                  {d.label}
                </span>
                <Stars value={value} size={12} />
              </span>
            );
          })}
        </div>
      ) : null}

      {contexts.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          {contexts.map((c) => (
            <span
              key={c}
              className="rounded-full border border-neutral-200 px-2.5 py-0.5 dark:border-neutral-700"
            >
              {c}
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );
}
