import dayjs from 'dayjs'
import type { ExtendedRecordMap } from 'notion-types'
import NotionRenderer from '#/components/NotionRenderer'
import Text from '#/components/Text'
import { cn } from '#/utils/classname'

export interface PageRenderProps {
  skeleton?: boolean
  title: string
  date?: string
  recordMap?: ExtendedRecordMap
}

export default function PageRenderer({ skeleton, title, date, recordMap }: PageRenderProps) {
  return (
    <>
      <header className="max-w-prose mx-auto mb-4">
        <h1 className="text-3xl font-serif font-black mb-2">
          <Text value={title} skeleton={skeleton} />
        </h1>
        <p
          className={cn(
            'text-sm prepend-zws',
            // Light mode
            'text-olive-500',
            // Dark mode
            'dark:text-mist-500',
          )}
        >
          {date && dayjs(date).format('YYYY-MM-DD')}
        </p>
      </header>
      <div className="notion-wrapper max-w-prose mx-auto">
        {recordMap ? (
          <NotionRenderer recordMap={recordMap} />
        ) : (
          <div>
            <div className="notion-text">
              <Text
                value="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad beatae culpa distinctio eaque ex, laborum possimus repellat sequi suscipit. Blanditiis deleniti facilis fuga itaque non numquam omnis porro rem temporibus."
                skeleton
              />
            </div>
            <div className="notion-text">
              <Text
                value="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet blanditiis dolorem excepturi explicabo?"
                skeleton
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
