import {
  Card,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Radio,
  RadioGroup,
} from '@blueprintjs/core'
import { produce } from 'immer'
import { MultiInput } from './components/MultiInput.js'
import { useState } from 'react'
import { type TTSConfig } from 'mi-gpt-tts'
import { TTSVolcano } from './components/TTSVolcano.js'

interface TtsConfig {
  config: {
    speaker: {
      tts?: string
      switchSpeakerKeywords?: string[]
    }
  }
  env: {
    AUDIO_SILENT?: string
    AUDIO_BEEP?: string
    AUDIO_ACTIVE?: string
    AUDIO_ERROR?: string
    TTS_BASE_URL?: string
  }
  tts?: Pick<TTSConfig, 'defaultSpeaker' | 'volcano'>
  gui?: {
    ttsProvider?: string
    publicIP?: string
    port?: number
  }
}

export function Tts(props: {
  config: TtsConfig
  onChange: (config: TtsConfig) => void
}) {
  const { config, onChange } = props

  const [tipTTS, setTipTTS] = useState<string>('default')

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <FormGroup label={'TTS 引擎'} inline>
          <HTMLSelect
            value={config.gui?.ttsProvider || 'xiaoai'}
            onChange={(event) => {
              const value = event.currentTarget.value
              const newState = produce(config, (draft) => {
                draft.config.speaker.tts =
                  value === 'xiaoai' ? undefined : 'custom'
                if (!draft.gui) {
                  draft.gui = {}
                }
                draft.gui.ttsProvider = value === 'xiaoai' ? undefined : value
              })
              onChange(newState)
            }}
          >
            <option value="xiaoai">默认</option>
            <option value="volcano">火山（豆包）</option>
            {/*<option value="edge">Edge 大声朗读</option>*/}
            {/*<option value="openai">OpenAI</option>*/}
            <option value="custom">自定义</option>
          </HTMLSelect>
          {/* 只要不是小爱，就提供说明 */}
          {config.config.speaker.tts === 'custom' && (
            <a
              href="https://migptgui.com/docs/faqs/tts"
              target={'_blank'}
              className={'tw-ml-2'}
            >
              查看说明
            </a>
          )}
        </FormGroup>

        {/* 只要不是小爱和自定义，就需要提供公网 IP 地址及端口 */}
        {config.config.speaker.tts === 'custom' &&
          config.gui?.ttsProvider !== 'custom' && (
            <FormGroup label={'对外 IP 地址'} inline>
              <InputGroup
                required
                value={config.gui?.publicIP || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.gui) {
                      draft.gui = {}
                    }
                    draft.gui.publicIP = newVal === '' ? undefined : newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
          )}

        {/* 火山配置项 */}
        {config.gui?.ttsProvider === 'volcano' && (
          <TTSVolcano
            value={config.tts}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.tts = value
              })
              onChange(newState)
            }}
          />
        )}

        {/* 自定义配置项 */}
        {config.gui?.ttsProvider === 'custom' && (
          <>
            <FormGroup label={'TTS_BASE_URL'} inline>
              <InputGroup
                required
                type={'url'}
                value={config.env?.TTS_BASE_URL || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    draft.env.TTS_BASE_URL = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
          </>
        )}

        {/* 只要不是小爱，就能使用切换音色关键词 */}
        {config.config.speaker.tts === 'custom' && (
          <FormGroup label={'切换音色关键词'} inline>
            <MultiInput
              value={config.config.speaker.switchSpeakerKeywords}
              onChange={(value) => {
                const newState = produce(config, (draft) => {
                  draft.config.speaker.switchSpeakerKeywords = value
                })

                onChange(newState)
              }}
            />
          </FormGroup>
        )}
      </Card>
      <Card>
        <FormGroup label={'提示音效'} inline>
          <RadioGroup
            className={'tw-mb-0'}
            inline
            selectedValue={tipTTS}
            onChange={(event) => {
              const value = event.currentTarget.value
              setTipTTS(value)

              // 切换回 default 时，如果配置过提示音效则清空
              if (value === 'default') {
                const newState = produce(config, (draft) => {
                  Object.assign(draft.env, {
                    AUDIO_SILENT: undefined,
                    AUDIO_BEEP: undefined,
                    AUDIO_ACTIVE: undefined,
                    AUDIO_ERROR: undefined,
                  })
                })
                onChange(newState)
              }
            }}
          >
            <Radio label="默认" value={'default'} />
            <Radio label="自定义" value={'custom'} />
          </RadioGroup>
        </FormGroup>

        {tipTTS === 'custom' && (
          <>
            {/*AUDIO_SILENT*/}
            <FormGroup label={'静音音频'} inline>
              <InputGroup
                type={'url'}
                value={config.env.AUDIO_SILENT || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    draft.env.AUDIO_SILENT = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
            {/*AUDIO_BEEP*/}
            <FormGroup label={'默认提示音'} inline>
              <InputGroup
                type={'url'}
                value={config.env.AUDIO_BEEP || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    draft.env.AUDIO_BEEP = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
            {/*AUDIO_ACTIVE*/}
            <FormGroup label={'唤醒提示音'} inline>
              <InputGroup
                type={'url'}
                value={config.env.AUDIO_ACTIVE || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    draft.env.AUDIO_ACTIVE = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
            {/*AUDIO_ERROR*/}
            <FormGroup label={'出错提示音'} inline>
              <InputGroup
                type={'url'}
                value={config.env.AUDIO_ERROR || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    draft.env.AUDIO_ERROR = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
          </>
        )}
      </Card>
    </div>
  )
}
