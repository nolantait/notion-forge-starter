import { ExtendedRecordMap } from '@types'

type Keys = { keys: string[]; rootKey: string | undefined }

export function getBlockKeys(recordMap: ExtendedRecordMap): Keys {
  const keys = Object.keys(recordMap?.block || {})
  const rootKey = keys[0]

  return { keys, rootKey }
}
