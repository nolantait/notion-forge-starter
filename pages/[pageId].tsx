import React from 'react'
import { NextPageContext } from 'next'

import { ResolvedPageProps, SiteMap } from '@types'
import { Config, getSiteMaps, resolveNotionPage } from '@lib'
import { NotionPage } from '@components'
import Layout from '@layouts/notion'

interface NotionPageContext extends NextPageContext {
  params?: {
    pageId: string
  }
}

interface Path {
  params: {
    pageId: string
  }
}

export const getStaticProps = async (context: NotionPageContext) => {
  const { domain } = Config
  console.log(context)
  const rawPageId = context.params?.pageId
  const isMachineReadable = hasMachineReadablePaths(rawPageId ?? '')

  try {
    if (isMachineReadable) return redirectTo(rawPageId)

    const props = await resolveNotionPage(domain, rawPageId)
    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (Config.isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMaps = await getSiteMaps()

  const mapSitemap = (siteMap: SiteMap) =>
    Object.keys(siteMap.canonicalPageMap).map(formatSitemapParams)
  const paths: Array<Path> = siteMaps.flatMap(mapSitemap)

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

function formatSitemapParams(pageId: string) {
  return {
    params: {
      pageId
    }
  }
}
