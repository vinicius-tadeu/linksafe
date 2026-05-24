import { prisma } from '../../lib/prisma.js'
import { UAParser } from 'ua-parser-js'

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
    include: {
      _count: { select: { clicks: true } },
    },
  })

  return links
}

export async function redirectLinkService(slug: string, userAgent?: string) {
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

  const parser = new UAParser(userAgent)
  const device = parser.getDevice().type ?? 'desktop'
  const browser = parser.getBrowser().name ?? null

  await prisma.click.create({
    data: {
      linkId: link.id,
      device,
      browser,
    },
  })

  return link.url
}

export async function getLinkAnalyticsService(linkId: string, userId: string) {
  const link = await prisma.link.findUnique({
    where: { id: linkId },
  })

  if (!link || link.userId !== userId) {
    throw new Error('Link não encontrado')
  }

  const clicks = await prisma.click.findMany({
    where: { linkId },
    orderBy: { createdAt: 'desc' },
  })

  const total = clicks.length

  const byDevice = clicks.reduce((acc, click) => {
    const key = click.device ?? 'unknown'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const byBrowser = clicks.reduce((acc, click) => {
    const key = click.browser ?? 'unknown'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return { total, byDevice, byBrowser, clicks }
}