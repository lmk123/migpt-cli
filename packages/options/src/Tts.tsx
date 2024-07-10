import {
  Button,
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
import { isLocalhost } from './utils.js'

// mi-gpt-tts 不支持指定用哪个服务来朗读，必须通过音色来指定，所以需要带上默认音色
// 举个例子，如果同时配置了 edge 和 volcano，且没有提供默认音色，那么会使用 volcano 来朗读
// 如果我就是想要用 edge 来朗读，那么就需要提供 edge 的默认音色
const defaultSpeakerMap: Record<string, string | undefined> = {
  edge: '云希',
  volcano: '灿灿',
  openai: 'Alloy',
}

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
  tts?: TTSConfig
  gui?: {
    ttsProvider?: string
    publicURL?: string
  }
}

export function Tts(props: {
  config: TtsConfig
  onChange: (config: TtsConfig) => void
  onPublicURLTest?: (url: string) => void
  onTtsTest?: () => void
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
                const defaultSpeaker = defaultSpeakerMap[value]
                if (defaultSpeaker) {
                  if (!draft.tts) {
                    draft.tts = {}
                  }
                  draft.tts.defaultSpeaker = defaultSpeaker
                }
              })
              onChange(newState)
            }}
          >
            <option value="xiaoai">默认</option>
            <option value="edge">Edge 大声朗读</option>
            <option value="volcano">火山（豆包）</option>
            <option value="openai">OpenAI</option>
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
            <FormGroup label={'对外地址'} inline>
              <InputGroup
                required
                type={'url'}
                value={config.gui?.publicURL || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.gui) {
                      draft.gui = {}
                    }
                    draft.gui.publicURL = newVal === '' ? undefined : newVal
                  })
                  onChange(newState)
                }}
                rightElement={
                  <Button
                    onClick={() => {
                      const url = config.gui?.publicURL
                      if (!url) {
                        alert('请先填写对外地址')
                        return
                      }
                      if (isLocalhost(url)) {
                        alert('不能使用本地地址')
                        return
                      }
                      if (props.onPublicURLTest) {
                        props.onPublicURLTest(url)
                      } else {
                        alert(
                          '在使用 migpt-server 时才支持检测对外地址是否可用',
                        )
                      }
                    }}
                  >
                    检测
                  </Button>
                }
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

        {/* edge 配置项*/}
        {config.gui?.ttsProvider === 'edge' && (
          <>
            <FormGroup label={'Trusted Token'} inline>
              <InputGroup
                required
                value={config.tts?.edge?.trustedToken || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.tts) {
                      draft.tts = {}
                    }
                    if (draft.tts.edge) {
                      draft.tts.edge.trustedToken = newVal
                    } else {
                      draft.tts.edge = {
                        trustedToken: newVal,
                      }
                    }
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
          </>
        )}

        {/* openai 配置项*/}
        {config.gui?.ttsProvider === 'openai' && (
          <>
            <FormGroup label={'密钥'} inline>
              <InputGroup
                required
                value={config.tts?.openai?.apiKey || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.tts) {
                      draft.tts = {}
                    }
                    if (draft.tts.openai) {
                      draft.tts.openai.apiKey = newVal
                    } else {
                      draft.tts.openai = {
                        apiKey: newVal,
                      }
                    }
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
            <FormGroup label={'模型'} inline>
              <InputGroup
                placeholder={'tts-1'}
                value={config.tts?.openai?.model || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.tts) {
                      draft.tts = {}
                    }
                    if (draft.tts.openai) {
                      draft.tts.openai.model = newVal
                    } else {
                      draft.tts.openai = {
                        apiKey: '',
                        model: newVal,
                      }
                    }
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>
            <FormGroup label={'接口地址'} inline>
              <InputGroup
                placeholder={'https://api.openai.com/v1'}
                value={config.tts?.openai?.baseUrl || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.tts) {
                      draft.tts = {}
                    }
                    if (draft.tts.openai) {
                      draft.tts.openai.baseUrl = newVal
                    } else {
                      draft.tts.openai = {
                        apiKey: '',
                        baseUrl: newVal,
                      }
                    }
                  })
                  onChange(newState)
                }}
                rightElement={
                  <span
                    className={`tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2`}
                  >
                    /audio/speech
                  </span>
                }
              />
            </FormGroup>
          </>
        )}

        {/* 只要不是小爱和自定义，就能配置音色 */}
        {config.config.speaker.tts === 'custom' &&
          config.gui?.ttsProvider !== 'custom' && (
            <>
              <FormGroup label={'音色'} inline>
                <InputGroup
                  required
                  value={config.tts?.defaultSpeaker || ''}
                  onValueChange={(val) => {
                    onChange(
                      produce(config, (draft) => {
                        if (!draft.tts) {
                          draft.tts = {}
                        }
                        draft.tts.defaultSpeaker = val === '' ? undefined : val
                      }),
                    )
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Button
                  onClick={() => {
                    if (props.onTtsTest) {
                      props.onTtsTest()
                    } else {
                      alert('在使用 migpt-server 时才支持测试语音配置')
                    }
                  }}
                >
                  测试语音配置
                </Button>
              </FormGroup>
            </>
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
                rightElement={
                  <span
                    className={
                      'tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2'
                    }
                  >
                    /tts.mp3
                  </span>
                }
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
