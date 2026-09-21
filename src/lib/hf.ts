const HF_BASE = "https://huggingface.co/api";

export type HfModel = {
  id: string;
  author: string | null;
  downloads: number;
  likes: number;
  pipelineTag: string | null;
  libraryName: string | null;
  tags: string[];
  license: string | null;
  gated: boolean;
  lastModified: string | null;
  createdAt: string | null;
};

export type HfSearchModel = HfModel & {
  trendingScore?: number;
};

function licenseFrom(tags: string[]): string | null {
  const t = tags.find((tag) => tag.startsWith("license:"));
  return t ? t.slice("license:".length) : null;
}

function normalize(raw: Record<string, unknown>): HfSearchModel {
  const tags = Array.isArray(raw.tags) ? (raw.tags as string[]) : [];
  return {
    id: String(raw.id ?? raw.modelId ?? ""),
    author: raw.author ? String(raw.author) : null,
    downloads: Number(raw.downloads ?? 0),
    likes: Number(raw.likes ?? 0),
    pipelineTag: raw.pipeline_tag ? String(raw.pipeline_tag) : null,
    libraryName: raw.library_name ? String(raw.library_name) : null,
    tags,
    license: licenseFrom(tags),
    gated: Boolean(raw.gated),
    lastModified: raw.lastModified ? String(raw.lastModified) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
    trendingScore:
      typeof raw.trendingScore === "number" ? raw.trendingScore : undefined,
  };
}

export function encodeModelId(id: string): string {
  return id
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

export async function searchModels(
  query: string,
  limit = 12,
): Promise<HfSearchModel[]> {
  const url = `${HF_BASE}/models?search=${encodeURIComponent(
    query,
  )}&limit=${limit}&sort=downloads&direction=-1&full=true`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Hugging Face search failed (${res.status})`);
  const data = (await res.json()) as Record<string, unknown>[];
  return data.filter((m) => m.id).map(normalize);
}

export async function getPopularModels(limit = 12): Promise<HfSearchModel[]> {
  const url = `${HF_BASE}/models?sort=downloads&direction=-1&limit=${limit}&full=true`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Hugging Face request failed (${res.status})`);
  const data = (await res.json()) as Record<string, unknown>[];
  return data.filter((m) => m.id).map(normalize);
}

export async function getModel(id: string): Promise<HfModel | null> {
  const url = `${HF_BASE}/models/${encodeModelId(id)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403) {
    // Gated/private model — the API refuses metadata, but the model still
    // exists and our local reviews should work.
    return {
      id,
      author: id.split("/")[0] ?? null,
      downloads: 0,
      likes: 0,
      pipelineTag: null,
      libraryName: null,
      tags: [],
      license: null,
      gated: true,
      lastModified: null,
      createdAt: null,
    };
  }
  if (!res.ok) throw new Error(`Hugging Face request failed (${res.status})`);
  const data = (await res.json()) as Record<string, unknown>;
  return normalize(data);
}
