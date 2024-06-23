import { type MiGPTConfig } from 'mi-gpt'
import { Tab, Tabs } from '@blueprintjs/core'
import { Characters } from './Characters'
import { useEffect, useState } from 'react'
import _set from 'lodash/set.js'
import { produce } from 'immer'
import { Speaker } from './Speaker'
import { Env } from './Env'

export interface RunConfig {
  /**
   * 运行 MiGPT 所需的环境变量
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
   */
  env: {
    OPENAI_API_KEY: string
    OPENAI_MODEL: string
    OPENAI_BASE_URL?: string
    AZURE_OPENAI_API_KEY?: string
    AUDIO_SILENT?: string
    AUDIO_BEEP?: string
    AUDIO_ACTIVE?: string
    AUDIO_ERROR?: string
    TTS_BASE_URL?: string
  }
  /**
   * MiGPT 的配置
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#migptjs
   */
  config: MiGPTConfig
}

export function Options(props: {
  config?: Partial<RunConfig>
  onChange: (config: Partial<RunConfig>) => void
}) {
  const { config, onChange } = props

  const [wholeConfig, setWholeConfig] = useState(config || {})

  useEffect(() => {
    setWholeConfig(config || {})
  }, [config])

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
              config={
                wholeConfig.config
                  ? {
                      systemTemplate: wholeConfig.config.systemTemplate,
                      bot: wholeConfig.config.bot,
                      master: wholeConfig.config.master,
                      room: wholeConfig.config.room,
                    }
                  : undefined
              }
              onChange={(characterConfig) => {
                setWholeConfig((prev) => {
                  const newState = produce(prev, (draft) => {
                    Object.assign(draft, characterConfig)
                  })

                  setTimeout(() => {
                    onChange(newState)
                  })
                  return newState
                })
              }}
            />
          }
        />
        <Tab
          id="yx"
          title="小爱音箱"
          panel={
            <Speaker
              config={wholeConfig.config?.speaker}
              onChange={(speakerConfig) => {
                setWholeConfig((prev) => {
                  const newState = produce(prev, (draft) => {
                    _set(draft, 'config.speaker', speakerConfig)
                  })

                  setTimeout(() => {
                    onChange(newState)
                  })
                  return newState
                })
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
              config={wholeConfig.env}
              onChange={(envConfig) => {
                setWholeConfig((prev) => {
                  const newState = produce(prev, (draft) => {
                    draft.env = envConfig
                  })

                  setTimeout(() => {
                    onChange(newState)
                  })
                  return newState
                })
              }}
            />
          }
        />
      </Tabs>
    </form>
  )
}
