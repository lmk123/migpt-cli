import { Card, FormGroup, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'
import { ChooseAI, ais } from './components/ChooseAI'
import { useState } from 'react'

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

  const [selectedAIName, setSelectedAIName] = useState<string | null>(null)

  const selectedAI = ais.find((ai) => ai.name === selectedAIName)

  return (
    <Card>
      <FormGroup
        inline
        label={'选择 AI 服务'}
        helperText={
          <>
            根据你选择的服务，将会自动填写部分 AI 配置。
            <a href="https://migptgui.com/docs/apply/" target={'_blank'}>
              查看说明
            </a>
          </>
        }
      >
        <ChooseAI
          value={selectedAIName}
          onChange={(name) => {
            setSelectedAIName(name)

            if (name == null) {
              if (config) {
                const newState = produce(config, (draft) => {
                  if (draft) {
                    draft.OPENAI_BASE_URL = undefined
                    draft.OPENAI_API_KEY = undefined
                    draft.OPENAI_MODEL = undefined
                  }
                })
                onChange(newState!)
              }
              return
            }

            const ai = ais.find((ai) => ai.name === name)
            if (ai) {
              const newState = produce(config, (draft) => {
                const c = draft || {}
                c.OPENAI_BASE_URL = ai.urlAPI
                c.OPENAI_MODEL = ai.models?.[0]
                return c
              })
              onChange(newState!)
            }
          }}
        ></ChooseAI>
      </FormGroup>
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
      <FormGroup
        label={'密钥'}
        inline
        helperText={
          selectedAI ? (
            <>
              <a href={selectedAI.urlDocs} target={'_blank'}>
                点击查看申请步骤
              </a>
            </>
          ) : undefined
        }
      >
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
      <FormGroup
        label={'模型'}
        inline
        helperText={
          selectedAI ? (
            <>
              {selectedAI.models && selectedAI.models.length > 1 && (
                <>
                  常用模型：
                  {selectedAI.models.map((model, i) => (
                    <>
                      <a
                        key={model}
                        onClick={() => {
                          const newState = produce(config, (draft) => {
                            if (draft) {
                              draft.OPENAI_MODEL = model
                            } else {
                              return { OPENAI_MODEL: model }
                            }
                          })
                          onChange(newState!)
                        }}
                      >
                        {model}
                      </a>
                      {i === selectedAI.models!.length - 1 ? '' : '、'}
                    </>
                  ))}
                </>
              )}

              {selectedAI.name === '豆包' && (
                <>
                  豆包需要填写接入点 ID，
                  <a
                    href="https://migptgui.com/docs/apply/doubao#create-endpoint"
                    target={'_blank'}
                  >
                    查看说明
                  </a>
                </>
              )}
            </>
          ) : undefined
        }
      >
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

      {!selectedAIName && (
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
      )}
    </Card>
  )
}
