import React from 'react'

// global styles shared across the entire site
import 'styles/base.scss'
import 'styles/components.scss'
import 'styles/global.scss'
import 'styles/utilities.scss'

// core styles shared by all of notion-forge (required)
import 'notion-forge/style'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'

// used for collection views selector (optional)
// TODO: re-add if we enable collection view dropdowns
// import 'rc-dropdown/assets/index.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'

// global style overrides for notion
import 'styles/notion.scss'

// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

// here we're bringing in any languages we want to support for
// syntax highlighting via Notion's Code block
import 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'

import { bootstrap } from 'lib/bootstrap-client'

if (typeof window !== 'undefined') {
  bootstrap()
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
