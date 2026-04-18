import { type, match } from 'arktype'
import { cn } from '#/utils/classname'

export interface TextProps {
  value?: string
  skeleton?: boolean
}

export default function Text(props: TextProps) {
  const { value } = props

  return match
    .case({ skeleton: 'true' }, () => (
      <span
        className={cn(
          'h-[1em] text-transparent rounded-md box-decoration-clone animate-pulse',
          // Light mode
          'bg-olive-500/20',
          // Dark mode
          'dark:bg-mist-500/20',
        )}
      >
        {value}
      </span>
    ))
    .case({ value: type.string.moreThanLength(0) }, () => <span>{value}</span>)
    .default(() => null)(props)
}
