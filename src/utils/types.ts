import { type } from 'arktype'

export const Uuid = type('string.uuid')

export const ValidNotionPage = type({
  properties: {
    title: {
      type: '"title"',
    },
  },
})
