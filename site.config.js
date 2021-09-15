module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '067dd719a912471ea9a3ac10710e7fdf',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Your name',
  domain: 'yourdomain.com',
  author: 'Your name',
  email: 'youremail@emailserver.tld',

  // open graph metadata (optional)
  description: 'A good description of your website',
  socialImageTitle: 'Your name',
  socialImageSubtitle: 'Hello World! 👋',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null
}
