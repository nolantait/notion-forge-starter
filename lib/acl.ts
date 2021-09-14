import { PageProps } from './types'
import { getBlockKeys } from './get-block-keys'

export async function pageAcl({
  site,
  recordMap,
  pageId
}: PageProps): Promise<PageProps> {
  if (!site) {
    return missingSite
  }

  const { domain, rootNotionSpaceId } = site

  if (!recordMap) {
    return missingRecordMap(domain, pageId)
  }

  const { keys, rootKey } = getBlockKeys(recordMap)

  if (!rootKey) {
    return invalidData(domain, pageId)
  }

  const rootValue = recordMap.block[rootKey]?.value
  const rootSpaceId = rootValue?.space_id

  if (rootSpaceId && rootNotionSpaceId && rootSpaceId !== rootNotionSpaceId) {
    if (process.env.NODE_ENV) {
      return missingPageError(domain, pageId)
    }
  }

  return {}
}

const missingSite = {
  error: {
    statusCode: 404,
    message: 'Unable to resolve notion site'
  }
}

const missingRecordMap = (domain: string, pageId: string) => {
  return {
    error: {
      statusCode: 404,
      message: `Unable to resolve page for domain "${domain}". Notion page "${pageId}" not found.`
    }
  }
}

const invalidData = (domain: string, pageId: string) => {
  return {
    error: {
      statusCode: 404,
      message: `Unable to resolve page for domain "${domain}". Notion page "${pageId}" invalid data.`
    }
  }
}

const missingPageError = (domain: string, pageId: string) => {
  return {
    error: {
      statusCode: 404,
      message: `Notion page "${pageId}" doesn't belong to the Notion workspace owned by "${domain}".`
    }
  }
}
