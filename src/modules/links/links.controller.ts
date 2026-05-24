import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { createLinkService, getLinksService, redirectLinkService } from './links.service.js'

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

  const url = await redirectLinkService(slug)

  return reply.redirect(url)
}