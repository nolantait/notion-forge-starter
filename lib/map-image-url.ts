import { Block } from 'notion-types'
import { Config } from './config'

const protocol = 'https://'
const baseNotionUrl = 'www.notion.so'

export const mapNotionImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error('Missing image url')
  }

  if (isData(url) || isCDN(url)) {
    return url
  }

  if (isRelativeImage(url)) {
    return mapImageUrl(`https://www.notion.so${url}`)
  }

  // more recent versions of notion don't proxy unsplash images
  if (!isUnsplash(url)) {
    const notionUrl = [
      protocol,
      baseNotionUrl,
      isRelativeImage(url) ? url : `/image/${encodeURIComponent(url)}`
    ].join('')

    url = buildNotionImageUrl(block, notionUrl)
  }

  return mapImageUrl(url)
}

export const mapImageUrl = (imageUrl: string) => {
  const { imageCDNHost } = Config

  if (imageUrl.startsWith('data:')) {
    return imageUrl
  }

  if (imageCDNHost) {
    // Our proxy uses Cloudflare's global CDN to cache these image assets
    return `${imageCDNHost}/${encodeURIComponent(imageUrl)}`
  } else {
    return imageUrl
  }
}

const isData = (url: string): boolean => {
  return url.startsWith('data:')
}

const isCDN = (url: string): boolean => {
  const { imageCDNHost } = Config

  return imageCDNHost ? url.startsWith(imageCDNHost) : false
}

const isRelativeImage = (url: string): boolean => {
  return url.startsWith('/images')
}

const isUnsplash = (url: string): boolean => {
  return url.startsWith('https://images.unsplash.com')
}

const buildNotionImageUrl = (block: Block, url: string): string => {
  const notionImageUrlV2 = new URL(url)
  const parentIsSpace = block.parent_table === 'space'
  let table = parentIsSpace ? 'block' : block.parent_table
  if (table === 'collection') {
    table = 'block'
  }

  notionImageUrlV2.searchParams.set('table', table)
  notionImageUrlV2.searchParams.set('id', block.id)
  notionImageUrlV2.searchParams.set('cache', 'v2')

  return notionImageUrlV2.toString()
}
