import React from 'react'
import Link, { LinkProps } from 'next/link'

interface PageLinkProps extends LinkProps {}

export const PageLink: React.FC<PageLinkProps> = ({
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
