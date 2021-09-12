import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cs from 'classnames'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'

// Notion
import { NotionRenderer } from 'notion-forge'
import { PageBlock } from 'notion-types'

// Lib
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { getPageStyle } from 'lib/get-page-style'
import { getPageTitle } from 'lib/get-page-title'
import * as types from 'lib/types'
import * as config from 'lib/config'

// Components
import { Loading } from '../layouts/loading'
import { Page404 } from '../layouts/page-404'

// Styles
import styles from '../layouts/styles.module.scss'

const pageLink = ({
  href,
  as,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  locale,
  ...props
}) => (
  <Link
    href={href}
    as={as}
    passHref={passHref}
    prefetch={prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    locale={locale}
  >
    <a {...props} />
  </Link>
)

const components = {
  pageLink
}

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  if (router.isFallback) {
    return <Loading />
  }

  // OEmbed Lite Mode Check
  const lite = useSearchParam('lite')
  const params: any = {}
  if (lite) params.lite = lite
  const isLiteMode = lite === 'true'
  const searchParams = new URLSearchParams(params)

  // Getting Page Data
  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value
  const title = getPageTitle(block, recordMap) || site.name

  // Page Error Checking
  if (error || !site || !keys.length || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  // Page URL Settings
  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)
  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  // Page Styling
  const pageStyle = getPageStyle(block, recordMap) ?? ''
  const cssTagFormat = (tag: string) => {
    return tag
      .split(' ')
      .map((t: string) => t.toLowerCase())
      .join('-')
  }
  const pageCssTag = pageStyle
    .split(',')
    .map((s) => s.trim())
    .map((style) => cssTagFormat(style))
  const showTableOfContents = pageStyle === 'Article'
  const minTableOfContentsItems = 3
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })

  // Head Setup
  const socialImage = mapNotionImageUrl(
    (block as PageBlock).format?.page_cover || config.defaultPageCover,
    block
  )
  const socialDescription =
    getPageDescription(block, recordMap) ?? config.description

  const previewImages = site.previewImages !== false

  // Debug
  console.log('notion page', {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap
  })
  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const notionRendererProps = {
    bodyClassName: cs(styles.notion),
    components,
    recordMap,
    rootPageId: site.rootNotionPageId,
    fullPage: !isLiteMode,
    darkMode: darkMode.value,
    previewImages: previewImages,
    showCollectionViewDropdown: false,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon: config.defaultPageIcon,
    defaultPageCover: config.defaultPageCover,
    defaultPageCoverPosition: config.defaultPageCoverPosition,
    mapPageUrl: siteMapPageUrl,
    mapImageUrl: mapNotionImageUrl
  }

  // Subcomponents

  return (
    <>
      <Head>
        {socialDescription && (
          <>
            <meta name='description' content={socialDescription} />
            <meta property='og:description' content={socialDescription} />
            <meta name='twitter:description' content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage} />
            <meta property='og:image' content={socialImage} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}

        {canonicalPageUrl && (
          <>
            <link rel='canonical' href={canonicalPageUrl} />
            <meta property='og:url' content={canonicalPageUrl} />
            <meta property='twitter:url' content={canonicalPageUrl} />
          </>
        )}

        <title>{title}</title>
      </Head>

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {pageCssTag && <BodyClassName className={cs(pageCssTag)} />}

      <NotionRenderer {...notionRendererProps} />
    </>
  )
}
