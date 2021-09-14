import React from 'react'
import Link from 'next/link'

export const PageLink = ({
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
