import { getSiteForDomain } from './get-site-for-domain'
import { Config } from './config'
import { Site } from '@types'

export async function getSites(): Promise<Site[]> {
  return [await getSiteForDomain(Config.domain)]
}
