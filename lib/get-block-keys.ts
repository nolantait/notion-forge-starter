import { ExtendedRecordMap } from "notion-types"

export function getBlockKeys(recordMap: ExtendedRecordMap): { keys: string[], rootKey: string } {
  const keys = Object.keys(recordMap.block)
  const rootKey = keys[0]

  return { keys, rootKey }
}
