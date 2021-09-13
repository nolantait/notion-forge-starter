import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'
import { ResolvedPageProps } from '../lib/types'
import { NextPageContext } from 'next'
import Layout from 'layouts/notion'

interface NotionPageContext extends NextPageContext {
  params?: {
    pageId: string
  }
}

export const getStaticProps = async (context: NotionPageContext) => {
  const rawPageId = context.params?.pageId
  const isMachineReadable = hasMachineReadablePaths(rawPageId ?? '')

  try {
    if (isMachineReadable) return redirectTo(rawPageId)

    const pageProps = await resolveNotionPage(domain, rawPageId)
    return { pageProps, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMaps = await getSiteMaps()

  const paths = siteMaps.flatMap((siteMap) =>
    Object.keys(siteMap.canonicalPageMap).map(formatSitemapPath)
  )

  return {
    paths,
    // paths: [],
    fallback: true
  }
}

export default function NotionDomainDynamicPage(props: ResolvedPageProps) {
  return (
    <Layout {...props}>
      <NotionPage {...props} />
    </Layout>
  )
}

function hasMachineReadablePaths(rawPageId: string): boolean {
  return rawPageId === 'sitemap.xml' || rawPageId === 'robots.txt'
}

function redirectTo(pageId: string) {
  return {
    redirect: {
      destination: `/api/${pageId}`,
      permanent: false
    }
  }
}

function formatSitemapPath(pageId: string) {
  return {
    params: {
      pageId
    }
  }
}
