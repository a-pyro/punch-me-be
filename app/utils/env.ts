import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  SESSION_SECRET: z.string(),
  PORT: z.string(),
})

const validationResult = envSchema.safeParse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PORT: process.env.PORT,
})

if (!validationResult.success) {
  throw new Error(`Invalid environment variables: ${validationResult.error}`)
}

export const env = validationResult.data
