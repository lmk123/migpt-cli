import { Characters } from './Characters'
import _set from 'lodash/set.js'
import _get from 'lodash/get.js'
import { produce } from 'immer'
import { Speaker } from './Speaker'
import { Env } from './Env'
import { type WholeConfig } from './type'
import { H3 } from '@blueprintjs/core'

export function Options(props: {
  config: WholeConfig
  onChange: (config: WholeConfig) => void
}) {
  const { config, onChange } = props

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
        <H3>AI / TTS</H3>
        <Env
          config={config.env}
          onChange={(envConfig) => {
            const newState = produce(config, (draft) => {
              draft.env = envConfig
            })
            onChange(newState)
          }}
        />
      </div>
    </div>
  )
}
