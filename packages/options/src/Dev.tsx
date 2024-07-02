import { Card, Checkbox, FormGroup } from '@blueprintjs/core'
import { MiGPTConfig } from 'mi-gpt'
import { produce } from 'immer'
import { NumberText } from './components/NumberText.js'

type DevOptions = Pick<
  MiGPTConfig['speaker'],
  'debug' | 'enableTrace' | 'timeout'
>

interface DevProps {
  config?: DevOptions
  onChange: (newConfig: DevOptions) => void
}

export function Dev(props: DevProps) {
  const { config, onChange } = props

  return (
    <div>
      <Card>
        <FormGroup label={'输出调试信息'} inline>
          <Checkbox
            checked={config?.debug == null ? false : config.debug}
            onChange={(event) => {
              const newVal = event.target.checked
              const newState = produce(config, (draft) => {
                const inner = draft || {}
                inner.debug = newVal || undefined
                return inner
              })!
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'输出小米服务日志'} inline>
          <Checkbox
            checked={config?.enableTrace == null ? false : config.enableTrace}
            onChange={(event) => {
              const newVal = event.target.checked
              const newState = produce(config, (draft) => {
                const inner = draft || {}
                inner.enableTrace = newVal || undefined
                return inner
              })!
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'网络超时时间'} inline>
          <NumberText
            placeholder={'5000'}
            value={config?.timeout || null}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                const inner = draft || {}
                inner.timeout = newVal || undefined
                return inner
              })!
              onChange(newState)
            }}
            rightElement={
              <span className="tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2">
                毫秒
              </span>
            }
          />
        </FormGroup>
      </Card>
    </div>
  )
}
