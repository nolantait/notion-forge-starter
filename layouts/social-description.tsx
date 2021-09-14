import React from 'react'

export const SocialDescription: React.FC<{ description: string }> = ({
  description
}) => {
  return (
    <>
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta name='twitter:description' content={description} />
    </>
  )
}
