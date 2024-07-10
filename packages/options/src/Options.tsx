import { Characters } from './Characters.js'
import { produce } from 'immer'
import { Speaker } from './Speaker.js'
import { type GuiConfig } from './type.js'
import { H3 } from '@blueprintjs/core'
import { Ai } from './Ai.js'
import { Tts } from './Tts.js'
import { Dev } from './Dev.js'
import { mergeWithUndefined } from './_utils.js'

export function Options(props: {
  config: GuiConfig
  onChange: (config: GuiConfig) => void
  onPublicURLTest?: (url: string) => void
  onTtsTest?: () => void
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
              mergeWithUndefined(draft.config, characterConfig)
            })
            onChange(newState)
          }}
        />
      </div>
      <div>
        <H3>音箱</H3>
        <Speaker
          config={config}
          onChange={(speakerConfig) => {
            const newState = produce(config, (draft) => {
              mergeWithUndefined(draft, speakerConfig)
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
        <Tts
          config={config}
          onChange={(ttsConfig) => {
            const newState = produce(config, (draft) => {
              mergeWithUndefined(draft, ttsConfig)
            })
            onChange(newState)
          }}
          onPublicURLTest={props.onPublicURLTest}
          onTtsTest={props.onTtsTest}
        />
      </div>
      <div>
        <H3>开发人员选项</H3>
        <Dev
          config={config.config.speaker}
          onChange={(newConfig) => {
            const newState = produce(config, (draft) => {
              Object.assign(draft.config.speaker, newConfig)
            })
            onChange(newState)
          }}
        />
      </div>
    </div>
  )
}
