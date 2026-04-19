import { lazy } from 'react'
import type { ComponentProps } from 'react'
import { NotionRenderer as _NotionRenderer } from 'react-notion-x'

const overrideComponents = {
  Tweet: lazy(async () => {
    const { default: Tweet } = await import('react-tweet-embed')
    return {
      default: ({ id }: { id: string }) => <Tweet tweetId={id} options={{ theme: 'dark' }} />,
    }
  }),
}

export default function NotionRenderer({
  components,
  ...props
}: ComponentProps<typeof _NotionRenderer>) {
  return (
    <_NotionRenderer
      {...props}
      components={{ ...overrideComponents, ...components }}
      mapImageUrl={url => url}
    />
  )
}
