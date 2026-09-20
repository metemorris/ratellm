import { type NextRequest } from "next/server";
import { searchModels } from "@/lib/hf";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return Response.json([]);
  }
  try {
    const models = await searchModels(q, 8);
    return Response.json(models);
  } catch {
    return Response.json({ error: "Search failed. Please try again." }, { status: 502 });
  }
}
