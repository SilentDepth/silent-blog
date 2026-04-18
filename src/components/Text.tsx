import { type, match } from 'arktype'

export interface TextProps {
  value?: string
  skeleton?: boolean
}

export default function Text(props: TextProps) {
  const { value } = props

  return match
    .case({ skeleton: 'true' }, () => (
      <span className="h-[1em] text-transparent bg-olive-200 rounded-md box-decoration-clone animate-pulse">
        {value}
      </span>
    ))
    .case({ value: type.string.moreThanLength(0) }, () => <span>{value}</span>)
    .default(() => null)(props)
}
