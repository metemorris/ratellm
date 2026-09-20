import { defineConfig } from 'prisma/config'

process.loadEnvFile()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.mts',
  },
})
