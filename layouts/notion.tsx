import React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { PageHead } from './page-head'
import { ResolvedPageProps } from '../lib/types'

interface Props extends ResolvedPageProps {
  children: React.ReactNode
}

export default function Layout(props: Props) {
  const { children } = props
  return (
    <>
      <PageHead {...props} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
