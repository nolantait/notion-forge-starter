import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import cs from 'classnames'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'

// Notion
import { NotionRenderer } from 'notion-forge'
import { PageBlock, ExtendedRecordMap } from 'notion-types'

// Lib
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
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
  if (props.error || shouldRenderError) {
    return RenderErrorPage(props)
  } else {
    return RenderNotionPage(props as ResolvedPageProps)
  }
}

const RenderErrorPage: React.FC<ErrorPageProps> = (props) => {
  return <Page404 {...props} />
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
  const block = recordMap.block[firstBlockKey].value as PageBlock
  const title = getPageTitle(block, recordMap) || site.name

  // Head Setup
  const { socialImage, socialDescription } = getSocialInfo(block, recordMap)

  // OEmbed Lite Mode Check
  const isLiteMode = lite === 'true'
  const params = isLiteMode ? lite : {}
  const searchParams = new URLSearchParams(params)
  const bodyClass = getBodyClass(block, recordMap, isLiteMode)

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

function shouldRenderError(props: ResolvedPageProps): boolean {
  const { recordMap } = props
  // Getting Page Data
  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value
  const isInvalid = !keys.length || !block

  return isInvalid
}

function getBodyClass(
  block: PageBlock,
  recordMap: ExtendedRecordMap,
  lite: boolean
): string[] {
  // Page Styling
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

function getSocialInfo(block: PageBlock, recordMap: ExtendedRecordMap) {
  const socialImage = mapNotionImageUrl(
    (block as PageBlock).format?.page_cover || Config.defaultPageCover,
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
