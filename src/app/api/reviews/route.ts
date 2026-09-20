import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getRatingSummary } from "@/lib/reviews";
import { saveReview, type ReviewInput } from "@/lib/review-service";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function int(value: unknown): number {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string") {
    const n = Number.parseInt(value, 10);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

export async function GET(request: NextRequest) {
  const modelId = request.nextUrl.searchParams.get("modelId");
  if (!modelId) {
    return Response.json({ error: "modelId is required." }, { status: 400, headers: CORS });
  }

  const [summary, reviews] = await Promise.all([
    getRatingSummary(modelId),
    prisma.review.findMany({
      where: { modelId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return Response.json({ modelId, summary, reviews }, { headers: CORS });
}

export async function POST(request: NextRequest) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400, headers: CORS });
  }

  const modelId = str(raw.modelId);
  if (!modelId) {
    return Response.json({ error: "modelId is required." }, { status: 400, headers: CORS });
  }

  const dimensions: Record<string, number> = {};
  if (raw.dimensions && typeof raw.dimensions === "object") {
    for (const [key, value] of Object.entries(raw.dimensions as Record<string, unknown>)) {
      const n = int(value);
      if (n >= 1 && n <= 5) dimensions[key] = n;
    }
  }

  const input: ReviewInput = {
    rating: int(raw.rating),
    body: typeof raw.body === "string" ? raw.body : "",
    title: str(raw.title),
    author: str(raw.author),
    useCase: str(raw.useCase) ?? "",
    contexts: Array.isArray(raw.contexts)
      ? raw.contexts.filter((c): c is string => typeof c === "string")
      : [],
    dimensions,
    deployment: str(raw.deployment),
    projectType: str(raw.projectType),
    hardware: str(raw.hardware),
  };

  const result = await saveReview(modelId, input);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400, headers: CORS });
  }

  return Response.json({ ok: true }, { headers: CORS });
}
