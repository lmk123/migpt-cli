import { Characters } from './Characters'
import _set from 'lodash/set.js'
import _get from 'lodash/get.js'
import { produce } from 'immer'
import { Speaker } from './Speaker'
import { Env } from './Env'
import { type WholeConfig } from './type'
import { H3 } from '@blueprintjs/core'
import { Ai } from './Ai'

function normalizeConfig(config: WholeConfig) {
  // 这里还是要用 immer，否则会报错
  return produce(config, (draft) => {
    // 传空字符串会导致系统模版被清空。
    // 未来应该在界面上给个选项，允许用户选择不使用系统模版。
    if (draft.config.systemTemplate === '') {
      delete draft.config.systemTemplate
    }
  })
}

export function Options(props: {
  config: WholeConfig
  onChange: (config: WholeConfig) => void
}) {
  const { config, onChange: o } = props

  const onChange = (config: WholeConfig) => {
    o(normalizeConfig(config))
  }

  return (
    <div className={'tw-space-y-6'}>
      <div>
        <H3>人设</H3>
        <Characters
          config={config.config}
          onChange={(characterConfig) => {
            const newState = produce(config, (draft) => {
              const mc = _get(draft, 'config', {})
              Object.assign(mc, characterConfig)
              const result = draft || {}
              _set(result, 'config', mc)
              return result
            })!
            console.log('newState', newState)
            onChange(newState)
          }}
        />
      </div>
      <div>
        <H3>音箱</H3>
        <Speaker
          config={config.config.speaker}
          onChange={(speakerConfig) => {
            const newState = produce(config, (draft) => {
              Object.assign(draft.config.speaker, speakerConfig)
            })
            onChange(newState)
          }}
        />
      </div>
      <div>
        <H3>AI 服务</H3>
        <Ai
          config={config.env}
          onChange={(aiConfig) => {
            const newState = produce(config, (draft) => {
              Object.assign(draft.env, aiConfig)
            })
            onChange(newState)
          }}
        />
      </div>
      <div>
        <H3>语音服务</H3>
        <Env
          config={config.env}
          onChange={(envConfig) => {
            const newState = produce(config, (draft) => {
              Object.assign(draft.env, envConfig)
            })
            onChange(newState)
          }}
        />
      </div>
    </div>
  )
}
