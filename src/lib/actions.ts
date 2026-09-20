"use server";

import { saveReview, type ReviewInput } from "@/lib/review-service";
import { DIMENSIONS } from "@/lib/survey";

export type ReviewFormState = {
  ok: boolean;
  error?: string;
};

function readString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() || null : null;
}

function readRating(formData: FormData, key: string): number {
  const value = readString(formData, key);
  if (!value) return 0;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? 0 : n;
}

export async function createReview(
  modelId: string,
  formData: FormData,
): Promise<ReviewFormState> {
  const dimensions: Record<string, number> = {};
  for (const d of DIMENSIONS) {
    const value = readRating(formData, `dim_${d.key}`);
    if (value) dimensions[d.key] = value;
  }

  const input: ReviewInput = {
    rating: readRating(formData, "rating"),
    body: readString(formData, "body") ?? "",
    title: readString(formData, "title"),
    author: readString(formData, "author"),
    useCase: readString(formData, "useCase") ?? "",
    contexts: formData
      .getAll("contexts")
      .filter((c): c is string => typeof c === "string"),
    dimensions,
    deployment: readString(formData, "deployment"),
    projectType: readString(formData, "projectType"),
    hardware: readString(formData, "hardware"),
  };

  return saveReview(modelId, input);
}
