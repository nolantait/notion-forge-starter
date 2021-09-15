import * as types from '@types'
import { getPageProperty } from 'notion-utils'

export function getPageStyle(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty('Style', block, recordMap)
}
