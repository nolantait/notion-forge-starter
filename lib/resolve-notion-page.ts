import { parsePageId as Parser } from 'notion-utils'

import * as acl from './acl'
import { ResolvedPageProps, PageProps } from './types'
import { Config } from './config'
import { getPage } from './notion'
import { getSiteMaps } from './get-site-maps'
import { getSiteForDomain } from './get-site-for-domain'

type MaybePageId = string | null

export async function resolveNotionPage(
  domain: string,
  rawPageId?: string
): Promise<PageProps> {
  const isValidId = rawPageId && rawPageId !== 'index'
  const resolveFunc = isValidId
    ? resolveById(rawPageId, domain)
    : resolveByDomain(domain)
  const pageProps = await resolveFunc
  const maybeAccessError = await acl.pageAcl(pageProps)

  return { ...pageProps, ...maybeAccessError }
}

async function resolveById(
  rawPageId: string,
  domain: string
): Promise<PageProps> {
  const maybePageId = parsePageId(rawPageId)

  if (maybePageId) {
    return fetchById(maybePageId, domain)
  }

  const idFromSitemap = await preparePageIdBySitemap(rawPageId)

  if (idFromSitemap) {
    // TODO: we're not re-using the site from siteMaps because it is
    // cached aggressively
    // site = await getSiteForDomain(domain)
    // recordMap = siteMap.pageMap[pageId]

    return fetchById(idFromSitemap, domain)
  }

  return {
    error: {
      message: `Not found "${rawPageId}"`,
      statusCode: 404
    }
  }
}

async function resolveByDomain(domain: string): Promise<ResolvedPageProps> {
  const site = await getSiteForDomain(domain)
  const pageId: string = site.rootNotionPageId
  const recordMap = await getPage(pageId)

  return { site, pageId, recordMap }
}

async function fetchById(
  pageId: string,
  domain: string
): Promise<ResolvedPageProps> {
  const resources = await Promise.all([
    getSiteForDomain(domain),
    getPage(pageId)
  ])

  return {
    pageId: pageId,
    site: resources[0],
    recordMap: resources[1]
  }
}

function parsePageId(pageId: string): MaybePageId {
  const parsedId = Parser(pageId)
  return parsedId ? parseWithOverrides(parsedId) : null
}

function parseWithOverrides(pageId: string): MaybePageId {
  const { pageUrlOverrides, pageUrlAdditions } = Config
  // check if the site configuration provides an override of a fallback for
  // the page's URI
  const override = pageUrlOverrides[pageId] || pageUrlAdditions[pageId]
  return override ? parsePageId(override) : null
}

async function preparePageIdBySitemap(rawPageId: string): Promise<MaybePageId> {
  // handle mapping of user-friendly canonical page paths to Notion page IDs
  // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
  const siteMaps = await getSiteMaps()
  const siteMap = siteMaps[0]
  return siteMap?.canonicalPageMap[rawPageId]
}
