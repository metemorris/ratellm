import { SearchBar } from "@/components/SearchBar";
import { ModelCard } from "@/components/ModelCard";
import { searchModels } from "@/lib/hf";
import { getRatingCounts } from "@/lib/reviews";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const models = query
    ? await searchModels(query, 24).catch(() => [])
    : [];
  const ratings = await getRatingCounts(models.map((m) => m.id));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="flex flex-col items-center py-14 text-center">
        <div className="flex w-full justify-center">
          <SearchBar />
        </div>
      </section>

      {query ? (
        <section className="pb-20">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Results for “{query}”
            </h2>
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {models.length} model{models.length === 1 ? "" : "s"}
            </span>
          </div>
          {models.length === 0 ? (
            <p className="rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              No models matched “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((m) => (
                <ModelCard key={m.id} model={m} rating={ratings.get(m.id)} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <p className="pb-20 text-center text-neutral-500 dark:text-neutral-400">
          Type a query to search Hugging Face models.
        </p>
      )}
    </div>
  );
}
