import Fastify from 'fastify'
import rateLimit from '@fastify/rate-limit'
import { authRoutes } from './modules/auth/auth.routes.js'
import { linksRoutes } from './modules/links/links.routes.js'
import { errorHandler } from './shared/middleware/error.middleware.js'

const app = Fastify({ logger: true })

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

app.listen({ port: 3000 }, (err) => {
  if (err) throw err
})