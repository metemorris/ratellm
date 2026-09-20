import { prisma } from "@/lib/db";
import { DIMENSIONS, parseDimensions } from "@/lib/survey";

export type DimensionAverage = {
  key: string;
  label: string;
  average: number;
  count: number;
};

export type RatingSummary = {
  count: number;
  average: number | null;
  histogram: [number, number, number, number, number];
  dimensions: DimensionAverage[];
};

export function buildHistogram(ratings: number[]): RatingSummary["histogram"] {
  const hist: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  for (const r of ratings) {
    if (r >= 1 && r <= 5) hist[r - 1] += 1;
  }
  return hist;
}

export async function getRatingSummary(modelId: string): Promise<RatingSummary> {
  const rows = await prisma.review.findMany({
    where: { modelId },
    select: { rating: true, dimensions: true },
  });

  const ratings = rows.map((r) => r.rating);
  const count = ratings.length;
  const average =
    count > 0 ? ratings.reduce((a, b) => a + b, 0) / count : null;

  const sums = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    for (const [key, value] of Object.entries(parseDimensions(row.dimensions))) {
      const cur = sums.get(key) ?? { sum: 0, count: 0 };
      sums.set(key, { sum: cur.sum + value, count: cur.count + 1 });
    }
  }

  const dimensions = DIMENSIONS.flatMap((d) => {
    const s = sums.get(d.key);
    if (!s) return [];
    return [
      {
        key: d.key,
        label: d.label,
        average: s.sum / s.count,
        count: s.count,
      },
    ];
  });

  return { count, average, histogram: buildHistogram(ratings), dimensions };
}

export async function getRatingCounts(
  ids: string[],
): Promise<Map<string, { count: number; average: number }>> {
  if (ids.length === 0) return new Map();
  const rows = await prisma.review.groupBy({
    by: ["modelId"],
    where: { modelId: { in: ids } },
    _count: { _all: true },
    _avg: { rating: true },
  });
  const map = new Map<string, { count: number; average: number }>();
  for (const row of rows) {
    map.set(row.modelId, {
      count: row._count._all,
      average: row._avg.rating ?? 0,
    });
  }
  return map;
}
