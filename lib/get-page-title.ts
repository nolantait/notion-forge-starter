import * as types from '@types'
import { getPageProperty } from 'notion-utils'

export function getPageTitle(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty('Title', block, recordMap)
}
