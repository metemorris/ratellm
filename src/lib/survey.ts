export type SurveyOption = {
  key: string;
  label: string;
};

export const USE_CASES: SurveyOption[] = [
  { key: "chat", label: "Chat / assistant" },
  { key: "code", label: "Code generation" },
  { key: "agents", label: "Agents / tool use" },
  { key: "classification", label: "Classification" },
  { key: "translation", label: "Translation" },
  { key: "summarization", label: "Summarization" },
  { key: "embeddings", label: "Embeddings / retrieval" },
  { key: "image", label: "Image generation" },
  { key: "audio", label: "Speech / audio" },
  { key: "finetune", label: "Fine-tuning base" },
  { key: "other", label: "Other" },
];

export const CONTEXTS: SurveyOption[] = [
  { key: "production", label: "In production" },
  { key: "prototype", label: "Prototype / experiment" },
  { key: "finetuned", label: "I fine-tuned it" },
  { key: "eval", label: "Just evaluating" },
];

export const DEPLOYMENTS: SurveyOption[] = [
  { key: "local", label: "Ran locally" },
  { key: "provider", label: "Via a provider / API" },
  { key: "both", label: "Both" },
];

export const DIMENSIONS: SurveyOption[] = [
  { key: "speed", label: "Speed" },
  { key: "quality", label: "Quality" },
  { key: "cost", label: "Cost / efficiency" },
  { key: "ease", label: "Ease of use" },
];

export const PROJECT_TYPES: SurveyOption[] = [
  { key: "personal", label: "Personal / hobby" },
  { key: "startup", label: "Startup" },
  { key: "enterprise", label: "Enterprise / work" },
  { key: "research", label: "Research / academic" },
  { key: "opensource", label: "Open-source project" },
  { key: "client", label: "Client work" },
  { key: "other", label: "Other" },
];

export function labelFor(
  options: SurveyOption[],
  key: string | null | undefined,
): string {
  if (!key) return "Other";
  return options.find((o) => o.key === key)?.label ?? key;
}

export function labelsFor(
  options: SurveyOption[],
  keys: string[] | null | undefined,
): string[] {
  if (!keys) return [];
  return keys.map((k) => labelFor(options, k));
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function parseDimensions(
  value: string | null | undefined,
): Record<string, number> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "number" && val >= 1 && val <= 5) out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}
