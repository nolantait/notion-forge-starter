import * as React from 'react'
import Head from 'next/head'
import cs from 'classnames'
import BodyClassName from 'react-body-classname'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'

// Notion
import { NotionRenderer } from 'notion-forge'
import { PageBlock, ExtendedRecordMap } from 'notion-types'

// Lib
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { getBlockKeys } from 'lib/get-block-keys'
import { getPageStyle } from 'lib/get-page-style'
import { getPageTitle } from 'lib/get-page-title'
import { PageProps, ErrorPageProps, ResolvedPageProps } from 'lib/types'
import { Config } from 'lib/config'

// Components
import { Loading } from '../layouts/loading'
import { Page404 } from '../layouts/page-404'
import { PageLink } from './notion/page-link'
import { SocialDescription } from '../layouts/social-description'
import { SocialImage } from '../layouts/social-image'
import { CanonicalPageUrl } from '../layouts/canonical-page-url'

// Styles
import styles from '../layouts/styles.module.scss'

const CustomizedComponents = {
  pageLink: PageLink
}

export const NotionPage: React.FC<PageProps> = (props) => {
  if (shouldRenderError(props)) {
    return RenderErrorPage(props as ErrorPageProps)
  } else {
    return RenderNotionPage(props as ResolvedPageProps)
  }
}

const RenderErrorPage: React.FC<ErrorPageProps> = (props) => {
  return <Page404 {...props} />
}

interface Page {
  block: PageBlock
  recordMap: ExtendedRecordMap
}

const RenderNotionPage: React.FC<ResolvedPageProps> = (props) => {
  const { recordMap, pageId, site } = props
  const router = useRouter()
  const lite = useSearchParam('lite')
  const previewImages = site.previewImages !== false

  if (router.isFallback) {
    return <Loading />
  }

  // Getting Page Data
  const blocks = recordMap.block
  const firstBlockKey = Object.keys(blocks)[0]
  const block = recordMap.block[firstBlockKey].value
  if (!block) throw new Error(`Could not find block ${firstBlockKey}`)

  const page: Page = { block: block as PageBlock, recordMap }
  const title = getPageTitle(block, recordMap) || site.name

  // Head Setup
  const { socialImage, socialDescription } = getSocialInfoForPage(page)

  // OEmbed Lite Mode Check
  const isLiteMode = lite === 'true'
  const params = isLiteMode ? lite : {}
  const searchParams = new URLSearchParams(params)
  const bodyClass = getBodyStyleForPage(page, isLiteMode)

  // Page URL Settings
  const { siteMapPageUrl, canonicalPageUrl } = getPageUrlSettings({
    site,
    recordMap,
    searchParams,
    pageId
  })

  const { defaultPageIcon, defaultPageCover, defaultPageCoverPosition } = Config

  const notionRendererProps = {
    recordMap,
    previewImages,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition,
    rootPageId: site.rootNotionPageId,
    fullPage: !isLiteMode,
    showCollectionViewDropdown: false,
    mapPageUrl: siteMapPageUrl,
    mapImageUrl: mapNotionImageUrl,
    bodyClassName: cs(styles.notion),
    components: CustomizedComponents
  }

  return (
    <>
      <Head>
        {socialDescription && (
          <SocialDescription description={socialDescription} />
        )}

        <SocialImage image={socialImage} />

        {canonicalPageUrl && <CanonicalPageUrl url={canonicalPageUrl} />}

        <title>{title}</title>
      </Head>

      <BodyClassName className={cs(bodyClass)} />

      <NotionRenderer {...notionRendererProps} />
    </>
  )
}

function shouldRenderError(props: PageProps): boolean {
  if (props.error) {
    return true
  }

  const { recordMap } = props
  const { rootKey } = getBlockKeys(recordMap)

  const block = recordMap?.block[rootKey]?.value
  const isInvalid = !rootKey || !block

  return isInvalid
}

function getBodyStyleForPage(page: Page, lite: boolean): string[] {
  // Page Styling
  const { block, recordMap } = page
  const baseStyle = getPageStyle(block, recordMap) ?? ''
  const formatTag = (tag: string) => {
    return tag
      .split(' ')
      .map((t: string) => t.toLowerCase())
      .join('-')
  }

  const style = baseStyle
    .split(',')
    .map((s) => s.trim())
    .map(formatTag)

  return lite ? style.concat(['notion-lite']) : style
}

function getSocialInfoForPage(page: Page) {
  const { block, recordMap } = page

  const socialImage = mapNotionImageUrl(
    block.format?.page_cover || Config.defaultPageCover,
    block
  )
  const socialDescription =
    getPageDescription(block, recordMap) ?? Config.description

  return { socialImage, socialDescription }
}

function getPageUrlSettings({ site, recordMap, searchParams, pageId }) {
  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)
  const canonicalPageUrl =
    !Config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  return { siteMapPageUrl, canonicalPageUrl }
}
