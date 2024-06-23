import { useEffect, useState } from 'react'
import { Button, Card, FormGroup, H5, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'

type EnvConfig = {
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

const defaultConfig = {}

export function Env(props: {
  config?: EnvConfig
  onChange: (config: EnvConfig) => void
}) {
  const { config = {} as EnvConfig, onChange } = props

  const [innerConfig, setInnerConfig] = useState(config || defaultConfig)

  useEffect(() => {
    setInnerConfig(config)
  }, [config])

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <H5>AI 服务</H5>
        <FormGroup label={'OPENAI_API_KEY'} inline>
          <InputGroup
            required
            value={innerConfig.OPENAI_API_KEY}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.OPENAI_API_KEY = newVal
                })
                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'OPENAI_MODEL'} inline>
          <InputGroup
            required
            value={innerConfig.OPENAI_MODEL}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.OPENAI_MODEL = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'OPENAI_BASE_URL'} inline>
          <InputGroup
            required
            value={innerConfig.OPENAI_BASE_URL}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.OPENAI_BASE_URL = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
            rightElement={<Button>/chat/completions</Button>}
          />
        </FormGroup>
        <FormGroup label={'AZURE_OPENAI_API_KEY'} inline>
          <InputGroup
            value={innerConfig.AZURE_OPENAI_API_KEY}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.AZURE_OPENAI_API_KEY = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
      </Card>

      <Card>
        <H5>提示音</H5>
        <FormGroup label={'AUDIO_SILENT'} inline>
          <InputGroup
            value={innerConfig.AUDIO_SILENT}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.AUDIO_SILENT = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_BEEP'} inline>
          <InputGroup
            value={innerConfig.AUDIO_BEEP}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.AUDIO_BEEP = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ACTIVE'} inline>
          <InputGroup
            value={innerConfig.AUDIO_ACTIVE}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.AUDIO_ACTIVE = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ERROR'} inline>
          <InputGroup
            value={innerConfig.AUDIO_ERROR}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.AUDIO_ERROR = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>自定义第三方 TTS</H5>
        <FormGroup label={'TTS_BASE_URL'} inline>
          <InputGroup
            value={innerConfig.TTS_BASE_URL}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.TTS_BASE_URL = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
