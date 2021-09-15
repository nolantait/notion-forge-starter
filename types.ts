import { ExtendedRecordMap, PageMap } from 'notion-types'

export * from 'notion-types'

export type SiteOption =
  | 'rootNotionPageId'
  | 'rootNotionSpaceId'
  | 'name'
  | 'domain'
  | 'email'
  | 'description'
  | 'socialImageSubtitle'
  | 'socialImageTitle'
  | 'defaultPageIcon'
  | 'defaultPageCover'
  | 'defaultPageCoverPosition'
  | 'imageCDNHost'
  | 'pageUrlOverrides'

export type OptionalSiteOption =
  | 'rootNotionSpaceId'
  | 'defaultPageIcon'
  | 'defaultPageCover'
  | 'imageCDNHost'
  | 'pageUrlOverrides'

export type SiteConfigValue = string | number | null

export type SiteConfig = {
  [index: string]: SiteConfigValue | Record<string, SiteConfigValue>

  rootNotionPageId: string
  rootNotionSpaceId: string | null
  name: string
  domain: string
  email: string
  description: string
  socialImageTitle: string
  socialImageSubtitle: string
  defaultPageIcon: string | null
  defaultPageCover: string | null
  defaultPageCoverPosition: number
  imageCDNHost: string | null
  pageUrlOverrides: Record<string, string> | null
}

export type WithChildren<T = {}> = T & { children?: React.ReactNode }

export interface PageError {
  message?: string
  statusCode: number
}

export type PageProps = ResolvedPageProps | ErrorPageProps

export interface ResolvedPageProps extends BasePageProps {
  site: Site
  recordMap: ExtendedRecordMap
  error?: undefined
}

export interface ErrorPageProps extends BasePageProps {
  error: PageError
}

interface BasePageProps {
  site?: Site
  recordMap?: ExtendedRecordMap
  pageId?: string
  error?: undefined | PageError
}

export interface Model {
  id: string
  userId: string
  createdAt: number
  updatedAt: number
}

export interface Site {
  name: string
  domain: string
  rootNotionPageId: string
  rootNotionSpaceId: string
  // Settings
  html?: string
  fontFamily?: string
  previewImages?: boolean
  // Opengraph Metadata
  description?: string
  image?: string
}

export interface SiteMap {
  site: Site
  pageMap: PageMap
  canonicalPageMap: CanonicalPageMap
}

export interface CanonicalPageMap {
  [canonicalPageId: string]: string
}

export interface PageUrlOverridesMap {
  // maps from a URL path to the notion page id the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pagePath: string]: string
}

export interface PageUrlOverridesInverseMap {
  // maps from a notion page id to the URL path the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pageId: string]: string
}

export interface PreviewImage {
  url: string
  originalWidth: number
  originalHeight: number
  width: number
  height: number
  type: string
  dataURIBase64: string
  error?: string
  statusCode?: number
}

export interface PreviewImageMap {
  [url: string]: PreviewImage
}
