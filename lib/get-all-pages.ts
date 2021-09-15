import pMemoize from 'p-memoize'
import { getAllPagesInSpace } from 'notion-utils'

import { SiteMap } from '@types'
import { Config } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'

const uuid = !!Config.includeNotionIdInUrls

export async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<SiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion)
  )

  const canonicalPageMap = Object.keys(pageMap).reduce<Record<string, any>>(
    (mappedPages, pageId: string) => {
      const recordMap = pageMap[pageId]

      if (!recordMap) throw new Error(`Error loading page "${pageId}"`)

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      const existingCanonicalId = mappedPages[canonicalPageId]

      if (existingCanonicalId) throw new Error('Duplicate canonical page ID')

      return {
        ...mappedPages,
        [canonicalPageId]: pageId
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}

export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })
