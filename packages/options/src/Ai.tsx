import { Card, FormGroup, InputGroup } from '@blueprintjs/core'
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
      <FormGroup label={'接口地址'} inline>
        <InputGroup
          required
          type={'url'}
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
          rightElement={
            <span
              className={`tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2`}
            >
              /chat/completions
            </span>
          }
        />
      </FormGroup>
      <FormGroup label={'密钥'} inline>
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
      <FormGroup label={'模型'} inline>
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
      <FormGroup label={'Azure 密钥'} inline>
        <InputGroup
          placeholder={'不使用 Azure OpenAI 服务请留空'}
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
