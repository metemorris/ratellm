# ratellm

Reviews for open-source AI models. Search open-source models on Hugging Face, rate them 1–5 stars, and read reviews from people who actually build with them.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4**
- **Prisma 6 + SQLite** (swap `DATABASE_URL` for Postgres in production)
- **Hugging Face API** (free, no token required)

## Getting started

```bash
pnpm install
pnpm prisma migrate dev   # create the SQLite database
pnpm prisma db seed       # optional: seed a few sample reviews
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database schema

```
Model {
  id          String  @id      // Hugging Face repo id, e.g. "mistralai/Mistral-7B-Instruct-v0.3"
  author      String?
  downloads   Int
  likes       Int
  pipelineTag String?           // "text-generation", "automatic-speech-recognition", ...
  libraryName String?
  tags        String            // JSON string[]
}

Review {
  id          String  @id @default(cuid())
  modelId     String  // -> Model.id
  rating      Int     // 1–5 overall
  title       String?
  body        String
  author      String? // defaults to "Anonymous"
  useCase     String  // what the model was used for
  contexts    String  // JSON string[] of usage context
  dimensions  String  // JSON { speed, quality, cost, ease } 1–5
  deployment  String? // "local" | "provider" | "both"
  hardware    String? // free text when running locally
  projectType String? // "personal" | "startup" | "enterprise" | ...
  createdAt   DateTime
}
```

Structured survey fields (use cases, dimensions, deployments, project types,
contexts) live in `src/lib/survey.ts`.

## API

- `GET  /api/reviews?modelId=...` — rating summary + reviews for a model.
- `POST /api/reviews` — create a review (`{ modelId, rating, body, useCase, … }`).
- `GET  /api/search?q=...` — Hugging Face model search.

These send permissive CORS headers so the Chrome extension can call them.

## Chrome extension

`extension/` is a Manifest v3 extension that adds a **★ ratellm** button to
Hugging Face model pages. It shows reviews and lets you leave one without
leaving the page. See `extension/README.md` for loading instructions.
