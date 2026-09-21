import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getModel } from "@/lib/hf";
import { upsertModel } from "@/lib/models";
import { getRatingSummary } from "@/lib/reviews";
import { formatDate, formatNumber } from "@/lib/format";
import { RatingSummary } from "@/components/RatingSummary";
import { WriteReview } from "@/components/WriteReview";
import { ReviewItem, type ReviewData } from "@/components/ReviewItem";

type Props = {
  params: Promise<{ id: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const modelId = id.join("/");
  return { title: `${modelId} — ratellm` };
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  const modelId = id.join("/");

  const model = await getModel(modelId);
  if (!model) notFound();

  await upsertModel(model);
  const summary = await getRatingSummary(modelId);
  const reviews = (await prisma.review.findMany({
    where: { modelId },
    orderBy: { createdAt: "desc" },
  })) as ReviewData[];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="py-8">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
        >
          ← All models
        </Link>
      </div>

      <header className="pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
          <span>{model.author ?? "unknown"}</span>
          {model.license ? <span>· {model.license}</span> : null}
          {model.gated ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              gated
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {model.id}
          </h1>
          <a
            href={`https://huggingface.co/${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-300"
          >
            View on Hugging Face ↗
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          {model.downloads > 0 ? (
            <>
              <span>{formatNumber(model.downloads)} downloads</span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span>{formatNumber(model.likes)} likes</span>
            </>
          ) : null}
          {model.lastModified ? (
            <>
              {model.downloads > 0 ? (
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
              ) : null}
              <span>Updated {formatDate(model.lastModified)}</span>
            </>
          ) : null}
          {model.gated ? (
            <>
              {model.downloads > 0 || model.lastModified ? (
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
              ) : null}
              <span>Gated on Hugging Face</span>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {model.pipelineTag ? (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {model.pipelineTag.replace(/-/g, " ")}
            </span>
          ) : null}
          {model.libraryName ? (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {model.libraryName}
            </span>
          ) : null}
        </div>
      </header>

      <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <RatingSummary summary={summary} />
        <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <WriteReview modelId={modelId} modelName={model.id} />
        </div>
      </section>

      <section className="pb-20 pt-10">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Reviews{" "}
          <span className="font-normal text-neutral-400 dark:text-neutral-500">
            ({summary.count})
          </span>
        </h2>
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
