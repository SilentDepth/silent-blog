import { createFileRoute } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { createOGImage } from '#/utils/og-image'

export const Route = createFileRoute('/playground/og-image')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const [scaled, setScaled] = useState(true)

  return (
    <div className="">
      <div className="p-10 flex justify-center bg-black">
        <OgImage
          data={{ title: '这是一行测试文本' }}
          style={{ scale: scaled ? '50%' : undefined }}
        />
      </div>
      <div className="px-10 py-4 border-t border-white/10" onClick={() => setScaled(val => !val)}>
        <label className="flex items-center gap-[0.25em]">
          <input type="checkbox" checked={scaled} onChange={() => setScaled(val => !val)} />
          <span>Scaled</span>
        </label>
      </div>
    </div>
  )
}

function OgImage({
  data,
  ...attrs
}: ComponentProps<'div'> & { data: Parameters<typeof createOGImage>[0] }) {
  const { value } = useAsync(() => createOGImage(data))

  return <div {...attrs} dangerouslySetInnerHTML={{ __html: value ?? '' }} />
}
