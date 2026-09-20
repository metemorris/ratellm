import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  CONTEXTS,
  DEPLOYMENTS,
  DIMENSIONS,
  PROJECT_TYPES,
  USE_CASES,
} from "@/lib/survey";

export type ReviewInput = {
  rating: number;
  body: string;
  title: string | null;
  author: string | null;
  useCase: string;
  contexts: string[];
  dimensions: Record<string, number>;
  deployment: string | null;
  projectType: string | null;
  hardware: string | null;
};

export type ReviewResult = {
  ok: boolean;
  error?: string;
};

const USE_CASE_KEYS = new Set(USE_CASES.map((u) => u.key));
const CONTEXT_KEYS = new Set(CONTEXTS.map((c) => c.key));
const DEPLOYMENT_KEYS = new Set(DEPLOYMENTS.map((d) => d.key));
const PROJECT_TYPE_KEYS = new Set(PROJECT_TYPES.map((p) => p.key));

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export async function saveReview(
  modelId: string,
  input: ReviewInput,
): Promise<ReviewResult> {
  const rating = input.rating;
  const body = input.body.trim();
  const title = input.title ? truncate(input.title, 200) : null;
  const author = input.author ? truncate(input.author, 80) : null;
  const useCase = input.useCase;
  const deployment = input.deployment;
  const projectType = input.projectType;
  const hardware = input.hardware;
  const contexts = input.contexts.filter((c) => CONTEXT_KEYS.has(c));

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please choose a star rating." };
  }
  if (body.length < 10) {
    return { ok: false, error: "Review is too short. Add a little more detail." };
  }
  if (body.length > 5000) {
    return { ok: false, error: "Review is too long (max 5000 characters)." };
  }
  if (!USE_CASE_KEYS.has(useCase)) {
    return { ok: false, error: "Please choose what you used the model for." };
  }
  if (deployment && !DEPLOYMENT_KEYS.has(deployment)) {
    return { ok: false, error: "Invalid deployment choice." };
  }
  if (projectType && !PROJECT_TYPE_KEYS.has(projectType)) {
    return { ok: false, error: "Invalid project type." };
  }

  const dimensions: Record<string, number> = {};
  for (const d of DIMENSIONS) {
    const value = input.dimensions[d.key];
    if (Number.isInteger(value) && value >= 1 && value <= 5) {
      dimensions[d.key] = value;
    }
  }

  const localDeployment = deployment === "local" || deployment === "both";

  await prisma.model.upsert({
    where: { id: modelId },
    create: { id: modelId },
    update: {},
  });

  await prisma.review.create({
    data: {
      modelId,
      rating,
      title,
      body: truncate(body, 5000),
      author: author ?? undefined,
      useCase,
      contexts: JSON.stringify(contexts),
      dimensions: JSON.stringify(dimensions),
      deployment,
      projectType,
      hardware: localDeployment && hardware ? truncate(hardware, 120) : null,
    },
  });

  revalidatePath(`/models/${modelId}`);
  revalidatePath("/");

  return { ok: true };
}
