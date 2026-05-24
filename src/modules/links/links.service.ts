import { prisma } from '../../lib/prisma.js'

function generateSlug(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createLinkService(url: string, userId: string, slug?: string) {
  const finalSlug = slug ?? generateSlug()

  const slugExists = await prisma.link.findUnique({
    where: { slug: finalSlug },
  })

  if (slugExists) {
    throw new Error('Slug já está em uso')
  }

  const link = await prisma.link.create({
    data: {
      url,
      slug: finalSlug,
      userId,
    },
  })

  return link
}

export async function getLinksService(userId: string) {
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return links
}

export async function redirectLinkService(slug: string) {
  const link = await prisma.link.findUnique({
    where: { slug },
  })

  if (!link) {
    throw new Error('Link não encontrado')
  }

  if (!link.active) {
    throw new Error('Link inativo')
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new Error('Link expirado')
  }

  await prisma.click.create({
    data: { linkId: link.id },
  })

  return link.url
}