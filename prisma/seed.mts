import { PrismaClient } from "@prisma/client";

process.loadEnvFile();

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.review.count();
  if (existing > 0) {
    console.log("Seed skipped — reviews already exist.");
    return;
  }

  const models = [
    {
      id: "sentence-transformers/all-MiniLM-L6-v2",
      author: "sentence-transformers",
      downloads: 100_000_000,
      likes: 5000,
      pipelineTag: "sentence-similarity",
      libraryName: "sentence-transformers",
      tags: ["sentence-similarity", "embeddings", "license:apache-2.0"],
    },
    {
      id: "mistralai/Mistral-7B-Instruct-v0.3",
      author: "mistralai",
      downloads: 2_400_000,
      likes: 3487,
      pipelineTag: "text-generation",
      libraryName: "transformers",
      tags: ["text-generation", "license:apache-2.0"],
    },
    {
      id: "openai/whisper-small",
      author: "openai",
      downloads: 15_000_000,
      likes: 4100,
      pipelineTag: "automatic-speech-recognition",
      libraryName: "transformers",
      tags: ["automatic-speech-recognition", "license:apache-2.0"],
    },
  ];

  for (const m of models) {
    await prisma.model.upsert({
      where: { id: m.id },
      create: { ...m, tags: JSON.stringify(m.tags) },
      update: {},
    });
  }

  const reviews = [
    {
      modelId: "sentence-transformers/all-MiniLM-L6-v2",
      rating: 5,
      title: "The default choice for quick embeddings",
      body: "Tiny, fast, and good enough for most semantic search prototypes. I use it as a baseline before reaching for something heavier. Not state of the art on hard retrieval tasks, but the speed-to-quality tradeoff is excellent.",
      author: "Ada",
      useCase: "embeddings",
      contexts: ["production", "finetuned"],
      dimensions: { speed: 5, quality: 4, cost: 5, ease: 5 },
      deployment: "provider",
      hardware: null,
      projectType: "enterprise",
    },
    {
      modelId: "sentence-transformers/all-MiniLM-L6-v2",
      rating: 4,
      title: "Great, but watch the context window",
      body: "Solid for short text. Performance drops noticeably on long documents, and it only handles English well. Fine for a first pass.",
      author: "Mara",
      useCase: "embeddings",
      contexts: ["prototype"],
      dimensions: { speed: 5, quality: 4, cost: 5 },
      deployment: "local",
      hardware: "MacBook Pro M1, 16GB",
      projectType: "personal",
    },
    {
      modelId: "mistralai/Mistral-7B-Instruct-v0.3",
      rating: 4,
      title: "Punches above its weight",
      body: "Runs comfortably on a single GPU and follows instructions reliably. I use it for summarization and simple classification in an internal tool. Occasionally verbose, but easy to steer.",
      author: "Devin",
      useCase: "summarization",
      contexts: ["production"],
      dimensions: { speed: 4, quality: 4, cost: 5, ease: 4 },
      deployment: "local",
      hardware: "RTX 4090, 24GB",
      projectType: "enterprise",
    },
    {
      modelId: "mistralai/Mistral-7B-Instruct-v0.3",
      rating: 3,
      title: "Decent, but not for agentic workloads",
      body: "Fine for single-turn tasks. Once I wired it into an agent loop with tool calling it struggled and hallucinated function args. Kept it for simpler flows.",
      author: "Sasha",
      useCase: "agents",
      contexts: ["prototype", "finetuned"],
      dimensions: { speed: 3, quality: 3, cost: 4, ease: 3 },
      deployment: "local",
      hardware: "A100 80GB",
      projectType: "startup",
    },
    {
      modelId: "openai/whisper-small",
      rating: 5,
      title: "Reliable transcription out of the box",
      body: "Used it to transcribe thousands of hours of meeting audio. Accuracy is great on clean English speech. Hallucinates on silence and heavy accents, so add VAD and a language hint.",
      author: "Rex",
      useCase: "audio",
      contexts: ["production"],
      dimensions: { speed: 4, quality: 5, cost: 4, ease: 4 },
      deployment: "both",
      hardware: "RTX 3090 + hosted API",
      projectType: "enterprise",
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        ...r,
        contexts: JSON.stringify(r.contexts),
        dimensions: JSON.stringify(r.dimensions),
      },
    });
  }

  console.log(`Seeded ${models.length} models and ${reviews.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
