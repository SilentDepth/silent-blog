import { type, match } from 'arktype'
import { cn } from '#/utils/classname'

export interface TextProps {
  value?: string
  skeleton?: boolean | number
}

export default function Text(props: TextProps) {
  const { value = 'o' } = props

  return match
    .case({ skeleton: 'true | number' }, ({ skeleton }) => {
      return (
        <span
          className={cn(
            'text-transparent rounded-md box-decoration-clone select-none animate-pulse',
            'bg-gray-500/20',
          )}
          style={{ fontSize: 'calc(1em / 1lh * 1em)' }}
        >
          {typeof skeleton === 'number' ? 'o'.repeat(skeleton) : value}
        </span>
      )
    })
    .case({ value: type.string.moreThanLength(0) }, () => <span>{value}</span>)
    .default(() => null)(props)
}
