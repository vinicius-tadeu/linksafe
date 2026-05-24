import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { createLinkService, getLinksService, redirectLinkService, getLinkAnalyticsService } from './links.service.js'

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(3).optional(),
})

export async function createLinkController(req: FastifyRequest, reply: FastifyReply) {
  const { url, slug } = createLinkSchema.parse(req.body)
  const userId = (req as any).userId

  const link = await createLinkService(url, userId, slug)

  return reply.status(201).send(link)
}

export async function getLinksController(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req as any).userId

  const links = await getLinksService(userId)

  return reply.status(200).send(links)
}

export async function redirectController(req: FastifyRequest, reply: FastifyReply) {
  const { slug } = req.params as { slug: string }
  const userAgent = req.headers['user-agent']

  const url = await redirectLinkService(slug, userAgent)

  return reply.redirect(url)
}

export async function getLinkAnalyticsController(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  const userId = (req as any).userId

  const analytics = await getLinkAnalyticsService(id, userId)

  return reply.status(200).send(analytics)
}