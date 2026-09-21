import { defineConfig } from 'prisma/config'

try {
  process.loadEnvFile()
} catch {
  // .env is optional — e.g. CI provides DATABASE_URL via the environment.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.mts',
  },
})
