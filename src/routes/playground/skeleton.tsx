import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Text from '#/components/Text'
import { cn } from '#/utils/classname'

export const Route = createFileRoute('/playground/skeleton')({
  component: RouteComponent,
})

function RouteComponent() {
  const [skeleton, setSkeleton] = useState(true)

  return (
    <div className="p-10" onClick={() => setSkeleton(val => !val)}>
      <h1 className={cn('text-3xl font-black bg-sky-200', !skeleton && 'font-serif')}>
        <Text value={'o'.repeat(26)} skeleton={skeleton} />
      </h1>
    </div>
  )
}
