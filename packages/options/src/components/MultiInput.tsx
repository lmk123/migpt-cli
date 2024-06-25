import { Button, Classes, InputGroup, UL } from '@blueprintjs/core'

export function MultiInput(props: {
  value?: string[]
  required?: boolean
  onChange: (value: string[]) => void
}) {
  const { required, value = [], onChange } = props
  const count = value.length || 1
  const CommandList = []

  for (let i = 0; i < count; i++) {
    const s = value[i] || ''
    CommandList.push(
      <li key={'text-' + i}>
        <InputGroup
          className={'tw-inline-block'}
          value={s}
          required={required}
          onValueChange={(newVal) => {
            const v = [...value]
            v[i] = newVal
            onChange(v)
          }}
        />
        <Button
          disabled={count <= 1}
          icon={'delete'}
          className={'tw-ml-1'}
          onClick={() => {
            const v = [...value]
            v.splice(i, 1)
            onChange(v)
          }}
        >
          删除
        </Button>
      </li>,
    )
  }

  return (
    <div>
      <UL className={Classes.LIST_UNSTYLED + ' tw-space-y-1'}>
        {CommandList}
        <li>
          <Button
            icon={'add'}
            onClick={() => {
              onChange([...value, ''])
            }}
          >
            添加
          </Button>
        </li>
      </UL>
    </div>
  )
}
