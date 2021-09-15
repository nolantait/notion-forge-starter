import { Config } from './config'
import { Site } from '@types'

export const getSiteForDomain = async (domain: string): Promise<Site> => {
  const { name, rootNotionPageId, rootNotionSpaceId, description } = Config

  return {
    domain,
    name,
    rootNotionPageId,
    rootNotionSpaceId,
    description
  }
}
