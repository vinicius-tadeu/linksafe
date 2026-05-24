import { FastifyInstance } from 'fastify'
import { createLinkController, getLinksController, redirectController, getLinkAnalyticsController } from './links.controller.js'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'

export async function linksRoutes(app: FastifyInstance) {
  app.post('/links', { preHandler: authMiddleware }, createLinkController)
  app.get('/links', { preHandler: authMiddleware }, getLinksController)
  app.get('/links/:id/analytics', { preHandler: authMiddleware }, getLinkAnalyticsController)
  app.get('/:slug', redirectController)
}