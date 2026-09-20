"use client";

import { useState, useTransition } from "react";
import { createReview } from "@/lib/actions";
import {
  CONTEXTS,
  DEPLOYMENTS,
  DIMENSIONS,
  PROJECT_TYPES,
  USE_CASES,
} from "@/lib/survey";
import { StarPicker } from "@/components/StarPicker";

type FormState = {
  ok: boolean;
  error?: string;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400";

const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-200";

const pillClass =
  "inline-block rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 transition-colors peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white dark:border-neutral-700 dark:text-neutral-300 dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-checked:text-neutral-900";

export function WriteReview({
  modelId,
  modelName,
}: {
  modelId: string;
  modelName: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [state, setState] = useState<FormState>({ ok: false });
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [dimensions, setDimensions] = useState<Record<string, number>>({});
  const [deployment, setDeployment] = useState("");
  const showHardware = deployment === "local" || deployment === "both";

  function setDim(key: string, value: number) {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setRating(0);
    setDimensions({});
    setDeployment("");
    setState({ ok: false });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", String(rating));
    for (const [key, value] of Object.entries(dimensions)) {
      formData.set(`dim_${key}`, String(value));
    }

    startTransition(async () => {
      const result = await createReview(modelId, formData);
      if (result.ok) {
        setDone(true);
        setOpen(false);
        reset();
      } else {
        setState(result);
      }
    });
  }

  if (!open) {
    return (
      <div>
        {done ? (
          <p className="mb-4 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white dark:bg-white dark:text-neutral-900">
            Thanks — your review is live.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <span className="text-star" aria-hidden="true">
            ★
          </span>
          Write a review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800 sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Rate this model
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {modelName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          className="text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          Cancel
        </button>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <span className={labelClass}>Overall rating</span>
          <span className="text-red-500">*</span>
        </div>
        <div className="mt-2">
          <StarPicker
            value={rating}
            onChange={setRating}
            ariaLabel="Overall rating"
            size={40}
          />
        </div>
      </div>

      {rating > 0 ? (
        <div className="reveal mt-6 space-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <div>
            <label htmlFor="body" className={labelClass}>
              Your review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={4}
              minLength={10}
              maxLength={5000}
              placeholder="What worked well? What didn't?"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              Title{" "}
              <span className="font-normal text-neutral-400 dark:text-neutral-500">
                (optional)
              </span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              maxLength={200}
              placeholder="One-line summary"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Rate the details</span>
            <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
              Optional — speed, quality, and more.
            </p>
            <div className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {DIMENSIONS.map((d) => (
                <div
                  key={d.key}
                  className="flex items-center justify-between px-3 py-2.5"
                >
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">
                    {d.label}
                  </span>
                  <StarPicker
                    value={dimensions[d.key] ?? 0}
                    onChange={(v) => setDim(d.key, v)}
                    allowClear
                    size={20}
                    ariaLabel={d.label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="useCase" className={labelClass}>
                What did you use it for?{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="useCase"
                name="useCase"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select a use case…
                </option>
                {USE_CASES.map((u) => (
                  <option key={u.key} value={u.key}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="projectType" className={labelClass}>
                What kind of project?{" "}
                <span className="font-normal text-neutral-400 dark:text-neutral-500">
                  (optional)
                </span>
              </label>
              <select
                id="projectType"
                name="projectType"
                defaultValue=""
                className={inputClass}
              >
                <option value="">Select a project type…</option>
                {PROJECT_TYPES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className={labelClass}>Where did you run it?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEPLOYMENTS.map((d) => (
                <label key={d.key} className="cursor-pointer">
                  <input
                    type="radio"
                    name="deployment"
                    value={d.key}
                    onChange={(e) => setDeployment(e.target.value)}
                    className="peer sr-only"
                  />
                  <span className={pillClass}>{d.label}</span>
                </label>
              ))}
            </div>
            {showHardware ? (
              <div className="mt-3">
                <label htmlFor="hardware" className={labelClass}>
                  Hardware{" "}
                  <span className="font-normal text-neutral-400 dark:text-neutral-500">
                    (optional)
                  </span>
                </label>
                <input
                  id="hardware"
                  name="hardware"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. RTX 4090, A100 80GB, MacBook M3"
                  className={inputClass}
                />
              </div>
            ) : null}
          </div>

          <div>
            <span className={labelClass}>How are you using it?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CONTEXTS.map((c) => (
                <label key={c.key} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="contexts"
                    value={c.key}
                    className="peer sr-only"
                  />
                  <span className={pillClass}>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="author" className={labelClass}>
              Your name{" "}
              <span className="font-normal text-neutral-400 dark:text-neutral-500">
                (optional)
              </span>
            </label>
            <input
              id="author"
              name="author"
              type="text"
              maxLength={80}
              placeholder="Anonymous"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {pending ? "Posting…" : "Post review"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
