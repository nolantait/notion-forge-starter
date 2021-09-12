import React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { PageHead } from './page-head'
import { Site } from '../lib/types'

interface Props {
  children: React.ReactNode
  site: Site
}

export default function Layout({ children, site }: Props) {
  return (
    <>
      <PageHead site={site} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
