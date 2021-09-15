import React from 'react'

interface CanonicalPageProps {
  url: string
}

export const CanonicalPage = ({ url }: CanonicalPageProps) => {
  return (
    <>
      <meta name='url' content={url} />
      <meta property='og:url' content={url} />
      <meta name='twitter:url' content={url} />
    </>
  )
}
