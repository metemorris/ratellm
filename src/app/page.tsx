import { SearchBar } from "@/components/SearchBar";
import { ModelCard } from "@/components/ModelCard";
import { getPopularModels } from "@/lib/hf";
import { getRatingCounts } from "@/lib/reviews";

// Live data — render at request time so the build doesn't need a DB or network.
export const dynamic = "force-dynamic";

export default async function Home() {
  const models = await getPopularModels(12).catch(() => []);
  const ratings = await getRatingCounts(models.map((m) => m.id));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="flex flex-col items-center py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
          Reviews for open-source AI models.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
          Search Hugging Face, rate the models you use, and see how they
          actually perform before you deploy.
        </p>
        <div className="mt-8 flex w-full justify-center">
          <SearchBar />
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Popular models
          </h2>
          <span className="text-sm text-neutral-400 dark:text-neutral-500">
            by downloads
          </span>
        </div>
        {models.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            Couldn’t reach Hugging Face right now. Please try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <ModelCard
                key={m.id}
                model={m}
                rating={ratings.get(m.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
