import { ExtendedRecordMap } from 'notion-types'
import { uuidToId, parsePageId } from 'notion-utils'

import { Site } from './types'
import { Config } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'

// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!Config.includeNotionIdInUrls

export const mapPageUrl = (
  site: Site,
  recordMap: ExtendedRecordMap,
  searchParams: URLSearchParams
) => (pageId = '') => {
  const { rootNotionPageId } = site
  const isRootId = uuidToId(pageId) === rootNotionPageId

  if (isRootId) {
    return createUrl('/', searchParams)
  } else {
    return createUrl(
      `/${getCanonicalPageId(pageId, recordMap, { uuid })}`,
      searchParams
    )
  }
}

export const getCanonicalPageUrl = (
  site: Site,
  recordMap: ExtendedRecordMap
) => (pageId = '') => {
  const { domain } = site
  const pageUuid = parsePageId(pageId, { uuid: true })
  const protocol = 'https'
  const baseUrl = [protocol, '://', domain].join('')
  const isRootId = uuidToId(pageId) === site.rootNotionPageId
  const canonicalPageId = getCanonicalPageId(pageUuid, recordMap, {
    uuid
  })

  if (isRootId) {
    return baseUrl
  } else {
    return `${baseUrl}/${canonicalPageId}`
  }
}

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
