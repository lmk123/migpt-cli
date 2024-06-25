import { InputGroup, type InputGroupProps } from '@blueprintjs/core'

function toStr(value: number | null) {
  return value === null ? '' : String(value)
}

function toNum(value: string) {
  const val = value.trim()
  if (val === '') {
    return null
  }
  return Number(val)
}

type NumberTextProps = Omit<
  InputGroupProps,
  'value' | 'onValueChange' | 'inputMode'
> & {
  value: number | null
  onValueChange: (value: number | null) => void
}

export function NumberText(props: NumberTextProps) {
  const { value, onValueChange, ...rest } = props
  return (
    <InputGroup
      inputMode={'numeric'}
      value={toStr(value)}
      onValueChange={(newValue) => {
        const n = toNum(newValue)

        if (Number.isNaN(n)) return

        onValueChange(n)
      }}
      {...rest}
    />
  )
}
