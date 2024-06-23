import { Button, Card, FormGroup, H5, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'

type EnvConfig = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  OPENAI_BASE_URL?: string
  AZURE_OPENAI_API_KEY?: string
  AUDIO_SILENT?: string
  AUDIO_BEEP?: string
  AUDIO_ACTIVE?: string
  AUDIO_ERROR?: string
  TTS_BASE_URL?: string
}

export function Env(props: {
  config: EnvConfig
  onChange: (config: EnvConfig) => void
}) {
  const { config, onChange } = props

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <H5>AI 服务</H5>
        <FormGroup label={'OPENAI_API_KEY'} inline>
          <InputGroup
            required
            value={config.OPENAI_API_KEY || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.OPENAI_API_KEY = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'OPENAI_MODEL'} inline>
          <InputGroup
            required
            value={config.OPENAI_MODEL || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.OPENAI_MODEL = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'OPENAI_BASE_URL'} inline>
          <InputGroup
            required
            value={config.OPENAI_BASE_URL || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.OPENAI_BASE_URL = newVal
              })
              onChange(newState)
            }}
            rightElement={<Button>/chat/completions</Button>}
          />
        </FormGroup>
        <FormGroup label={'AZURE_OPENAI_API_KEY'} inline>
          <InputGroup
            value={config.AZURE_OPENAI_API_KEY || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.AZURE_OPENAI_API_KEY = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>

      <Card>
        <H5>提示音</H5>
        <FormGroup label={'AUDIO_SILENT'} inline>
          <InputGroup
            value={config.AUDIO_SILENT || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.AUDIO_SILENT = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_BEEP'} inline>
          <InputGroup
            value={config.AUDIO_BEEP || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.AUDIO_BEEP = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ACTIVE'} inline>
          <InputGroup
            value={config.AUDIO_ACTIVE || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.AUDIO_ACTIVE = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'AUDIO_ERROR'} inline>
          <InputGroup
            value={config.AUDIO_ERROR || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.AUDIO_ERROR = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>自定义第三方 TTS</H5>
        <FormGroup label={'TTS_BASE_URL'} inline>
          <InputGroup
            value={config.TTS_BASE_URL || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.TTS_BASE_URL = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
