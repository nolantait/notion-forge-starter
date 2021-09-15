import { ExtendedRecordMap } from '@types'
import {
  parsePageId,
  getCanonicalPageId as getCanonicalPageIdImpl
} from 'notion-utils'

import { Config } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string {
  const cleanPageId = parsePageId(pageId, { uuid: false })

  const override = Config.inversePageUrlOverrides[cleanPageId]

  if (override) return override

  const canonicalPageId = getCanonicalPageIdImpl(pageId, recordMap, {
    uuid
  })

  if (!canonicalPageId) throw new Error('Invalid canonical page ID')

  return canonicalPageId
}
