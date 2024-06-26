import {
  Card,
  FormGroup,
  H5,
  InputGroup,
  Radio,
  RadioGroup,
} from '@blueprintjs/core'
import { produce } from 'immer'
import { MultiInput } from './components/MultiInput'

interface TtsConfig {
  speaker: {
    tts?: string
    switchSpeakerKeywords?: string[]
  }
  env?: {
    AUDIO_SILENT?: string
    AUDIO_BEEP?: string
    AUDIO_ACTIVE?: string
    AUDIO_ERROR?: string
    TTS_BASE_URL?: string
  }
}

export function Tts(props: {
  config: TtsConfig
  onChange: (config: TtsConfig) => void
}) {
  const { config, onChange } = props

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <FormGroup label={'TTS 引擎'} inline>
          <RadioGroup
            className={'tw-mb-0'}
            inline
            selectedValue={config.speaker.tts || 'xiaoai'}
            onChange={(event) => {
              const value = event.currentTarget.value
              const newState = produce(config, (draft) => {
                draft.speaker.tts = value === 'xiaoai' ? undefined : value
              })
              onChange(newState)
            }}
          >
            <Radio label="默认" value={'xiaoai'} />
            <Radio label="自定义" value={'custom'} />
            {config.speaker.tts === 'custom' && (
              <a href="https://migptgui.com/docs/faqs/tts" target={'_blank'}>
                查看说明
              </a>
            )}
          </RadioGroup>
        </FormGroup>

        {config.speaker.tts === 'custom' && (
          <>
            <FormGroup label={'TTS_BASE_URL'} inline>
              <InputGroup
                required
                value={config.env?.TTS_BASE_URL || ''}
                onValueChange={(newVal) => {
                  const newState = produce(config, (draft) => {
                    if (!draft.env) {
                      draft.env = {}
                    }
                    draft.env.TTS_BASE_URL = newVal
                  })
                  onChange(newState)
                }}
              />
            </FormGroup>

            <FormGroup label={'切换音色关键词'} inline>
              <MultiInput
                value={config.speaker.switchSpeakerKeywords}
                onChange={(value) => {
                  const newState = produce(config, (draft) => {
                    draft.speaker.switchSpeakerKeywords = value
                  })

                  onChange(newState)
                }}
              />
            </FormGroup>
          </>
        )}
      </Card>
      <Card>
        <H5>提示音</H5>
        <FormGroup label={'AUDIO_SILENT'} inline>
          <InputGroup
            value={config.env?.AUDIO_SILENT || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                if (!draft.env) {
                  draft.env = {}
                }
                draft.env.AUDIO_SILENT = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_BEEP'} inline>
          <InputGroup
            value={config.env?.AUDIO_BEEP || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                if (!draft.env) {
                  draft.env = {}
                }
                draft.env.AUDIO_BEEP = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ACTIVE'} inline>
          <InputGroup
            value={config.env?.AUDIO_ACTIVE || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                if (!draft.env) {
                  draft.env = {}
                }
                draft.env.AUDIO_ACTIVE = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ERROR'} inline>
          <InputGroup
            value={config.env?.AUDIO_ERROR || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                if (!draft.env) {
                  draft.env = {}
                }
                draft.env.AUDIO_ERROR = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
