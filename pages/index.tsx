import React from 'react'

import { ResolvedPageProps } from '@types'
import { Config, resolveNotionPage } from '@lib'
import { NotionPage } from '@components'
import Layout from '@layouts/notion'

export const getStaticProps = async () => {
  const { domain } = Config

  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props: ResolvedPageProps) {
  return (
    <Layout {...props}>
      <NotionPage {...props} />
    </Layout>
  )
}
