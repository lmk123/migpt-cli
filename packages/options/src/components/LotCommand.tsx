import { InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'
import { NumberText } from './NumberText'

export function LotCommand(props: {
  value?: (number | undefined)[]
  required?: boolean
  count: number
  onChange: (value: (number | undefined)[]) => void
}) {
  const { required, value = [], count, onChange } = props

  const CommandList = []

  for (let i = 0; i < count; i++) {
    const n = value[i]
    CommandList.push(
      <NumberText
        key={'command-' + i}
        className={'tw-inline-block tw-w-[30px] tw-min-w-0'}
        value={n == null ? null : n}
        required={required}
        pattern={'\\d+'}
        onValueChange={(newVal) => {
          const v = produce(value, (draft) => {
            draft[i] = newVal == null ? undefined : newVal
          })
          onChange(v)
        }}
      />,
    )
    if (i !== count - 1) {
      CommandList.push(<span key={'split' + i}>, </span>)
    }
  }

  return (
    <div>
      <span className={'tw-text-2xl'}>[ </span>
      {CommandList}
      <span className={'tw-text-2xl'}> ]</span>
    </div>
  )
}