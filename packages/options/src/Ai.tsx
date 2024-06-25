import { Button, Card, FormGroup, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'

type AiConfig = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  OPENAI_BASE_URL?: string
  AZURE_OPENAI_API_KEY?: string
}

export function Ai(props: {
  config: AiConfig | undefined
  onChange: (config: AiConfig) => void
}) {
  const { config, onChange } = props

  return (
    <Card>
      <p>
        <a href="https://migptgui.com/docs/apply/" target={'_blank'}>
          点击查看 AI 服务申请教程
        </a>
      </p>
      <FormGroup label={'OPENAI_API_KEY'} inline>
        <InputGroup
          required
          value={config?.OPENAI_API_KEY || ''}
          onValueChange={(newVal) => {
            const newState = produce(config, (draft) => {
              if (draft) {
                draft.OPENAI_API_KEY = newVal
              } else {
                return { OPENAI_API_KEY: newVal }
              }
            })
            onChange(newState!)
          }}
        />
      </FormGroup>
      <FormGroup label={'OPENAI_MODEL'} inline>
        <InputGroup
          required
          value={config?.OPENAI_MODEL || ''}
          onValueChange={(newVal) => {
            const newState = produce(config, (draft) => {
              if (draft) {
                draft.OPENAI_MODEL = newVal
              } else {
                return { OPENAI_MODEL: newVal }
              }
            })
            onChange(newState!)
          }}
        />
      </FormGroup>
      <FormGroup label={'OPENAI_BASE_URL'} inline>
        <InputGroup
          required
          value={config?.OPENAI_BASE_URL || ''}
          onValueChange={(newVal) => {
            const newState = produce(config, (draft) => {
              if (draft) {
                draft.OPENAI_BASE_URL = newVal
              } else {
                return { OPENAI_BASE_URL: newVal }
              }
            })
            onChange(newState!)
          }}
          rightElement={<Button>/chat/completions</Button>}
        />
      </FormGroup>
      <FormGroup label={'AZURE_OPENAI_API_KEY'} inline>
        <InputGroup
          value={config?.AZURE_OPENAI_API_KEY || ''}
          onValueChange={(newVal) => {
            const newState = produce(config, (draft) => {
              if (draft) {
                draft.AZURE_OPENAI_API_KEY = newVal
              } else {
                return { AZURE_OPENAI_API_KEY: newVal }
              }
            })
            onChange(newState!)
          }}
        />
      </FormGroup>
    </Card>
  )
}
