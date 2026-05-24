import Fastify from 'fastify'
import rateLimit from '@fastify/rate-limit'
import { authRoutes } from './modules/auth/auth.routes.js'
import { linksRoutes } from './modules/links/links.routes.js'
import { errorHandler } from './shared/middleware/error.middleware.js'
import { env } from './config/env.js'

export const app = Fastify({ logger: false })

app.setErrorHandler(errorHandler)

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    message: 'Muitas requisições. Tente novamente em 1 minuto.',
  }),
})

app.register(authRoutes)
app.register(linksRoutes)

app.get('/health', async () => {
  return { status: 'ok' }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: env.PORT }, (err) => {
    if (err) throw err
  })
}