import { Tab, Tabs } from '@blueprintjs/core'
import { Characters } from './Characters'
import { useState } from 'react'
import _set from 'lodash/set.js'
import _get from 'lodash/get.js'
import { produce } from 'immer'
import { Speaker } from './Speaker'
import { Env } from './Env'
import { type WholeConfig } from './type'

export function Options(props: {
  config: WholeConfig
  onChange: (config: WholeConfig) => void
}) {
  const { config, onChange } = props

  const [tabId, setTabId] = useState('rs')

  return (
    <form>
      <Tabs
        id={'option-tabs'}
        selectedTabId={tabId}
        onChange={(newTabId) => {
          setTabId(String(newTabId))
        }}
      >
        <Tab
          id="rs"
          title="人设"
          panel={
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
          }
        />
        <Tab
          id="yx"
          title="小爱音箱"
          panel={
            <Speaker
              config={config.config.speaker}
              onChange={(speakerConfig) => {
                const newState = produce(config, (draft) => {
                  Object.assign(draft.config.speaker, speakerConfig)
                })
                onChange(newState)
              }}
            />
          }
          panelClassName="ember-panel"
        />
        <Tab
          id="ai"
          title="AI / TTS"
          panel={
            <Env
              config={config.env}
              onChange={(envConfig) => {
                const newState = produce(config, (draft) => {
                  draft.env = envConfig
                })
                onChange(newState)
              }}
            />
          }
        />
      </Tabs>
    </form>
  )
}
