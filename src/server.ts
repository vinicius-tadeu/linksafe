import Fastify from 'fastify'
import { authRoutes } from './modules/auth/auth.routes'

const app = Fastify({ logger: true })

app.register(authRoutes)

app.get('/health', async () => {
  return { status: 'ok' }
})

app.listen({ port: 3000 }, (err) => {
  if (err) throw err
})