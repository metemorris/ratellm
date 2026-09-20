import { prisma } from "@/lib/db";
import type { HfModel } from "@/lib/hf";

export async function upsertModel(model: HfModel) {
  const data = {
    author: model.author,
    downloads: model.downloads,
    likes: model.likes,
    pipelineTag: model.pipelineTag,
    libraryName: model.libraryName,
    tags: JSON.stringify(model.tags),
  };
  await prisma.model.upsert({
    where: { id: model.id },
    create: { id: model.id, ...data },
    update: data,
  });
}
