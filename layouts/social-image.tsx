import React from 'react'

export const SocialImage: React.FC<{ image: string | undefined }> = ({
  image
}) => {
  const defaultCard = <meta name='twitter:card' content='summary' />

  if (!image) return defaultCard

  return (
    <>
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={image} />
      <meta property='og:image' content={image} />
    </>
  )
}
