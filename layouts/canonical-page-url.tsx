import React from 'react'

export const CanonicalPageUrl: React.FC<{ url: string }> = ({ url }) => {
  return (
    <>
      <meta name='url' content={url} />
      <meta property='og:url' content={url} />
      <meta name='twitter:url' content={url} />
    </>
  )
}
