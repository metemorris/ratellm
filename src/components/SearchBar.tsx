"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { HfSearchModel } from "@/lib/hf";
import { formatNumber } from "@/lib/format";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HfSearchModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        setResults(res.ok ? ((await res.json()) as HfSearchModel[]) : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  function go(modelId: string) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/models/${modelId}`);
  }

  return (
    <div className="relative w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = query.trim();
          if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
        }}
      >
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter" && results.length > 0) {
                e.preventDefault();
                go(results[0].id);
              }
            }}
            placeholder="Search models… e.g. llama, mistral, whisper"
            className="w-full rounded-full border border-neutral-300 bg-white py-3 pl-11 pr-4 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
            autoComplete="off"
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </form>

      {open && query.trim().length >= 2 ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {loading ? (
            <div className="px-4 py-3 text-sm text-neutral-400 dark:text-neutral-500">
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-400 dark:text-neutral-500">
              No models found for “{query.trim()}”.
            </div>
          ) : (
            <ul className="max-h-96 overflow-auto">
              {results.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => go(m.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {m.id}
                      </div>
                      <div className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                        {m.pipelineTag?.replace(/-/g, " ") ?? "model"}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
                      {formatNumber(m.downloads)} downloads
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
