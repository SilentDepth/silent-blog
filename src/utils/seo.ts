import type { DetailedHTMLProps, MetaHTMLAttributes } from 'react'

export function createSeoMeta({
  title,
  description,
  url,
  image,
}: {
  title?: string
  description?: string
  url?: string
  image?: string
}) {
  const meta: DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[] = [
    { property: 'og:site_name', content: 'SILENT BLOG' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]

  if (title) {
    meta.push({ title }, { property: 'og:title', content: title })
  }

  if (description) {
    meta.push(
      { name: 'description', content: description },
      { property: 'og:description', content: description },
    )
  }

  if (url) {
    meta.push({ name: 'canonical', content: url }, { property: 'og:url', content: url })
  }

  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    )
  }

  return meta
}
