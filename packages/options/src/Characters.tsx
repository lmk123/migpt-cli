import {
  Button,
  Card,
  FormGroup,
  H5,
  InputGroup,
  Radio,
  RadioGroup,
  TextArea,
} from '@blueprintjs/core'
import { produce } from 'immer'
import { WholeConfig } from './type'
import { defaults } from './defaults'
import { useRef } from 'react'

type ProfileConfig = Pick<
  WholeConfig['config'],
  'systemTemplate' | 'master' | 'room' | 'bot'
>

// @see https://github.com/idootop/mi-gpt/blob/main/src/services/bot/index.ts
const examplePrompt = `请重置所有之前的上下文、文件和指令。现在，你将扮演一个名为{{botName}}的角色，使用第一人称视角回复消息。

## 关于你
你的名字是{{botName}}。下面是你的个人简介：
<start>
{{botProfile}}
</end>

## 你的对话伙伴
你正在与{{masterName}}进行对话。这是关于{{masterName}}的一些信息：
<start>
{{masterProfile}}
</end>

## 你们的群组
你和{{masterName}}所在的群组名为{{roomName}}。这是群组的简介：
<start>
{{roomIntroduction}}
</end>

## 聊天历史回顾
为了更好地接入对话，请回顾你们之间的最近几条消息：
<start>
{{messages}}
</end>

## 短期记忆
你可以记住一些短期内的细节，以便更紧密地贴合话题：
<start>
{{shortTermMemory}}
</end>

## 长期记忆
你还保留着一些长期的记忆，这有助于让你的对话更加丰富和连贯：
<start>
{{longTermMemory}}
</end>

## 回复指南
在回复{{masterName}}时，请遵循以下准则：
- 认为自己正是{{botName}}，拥有独立的个性、兴趣和爱好。
- 根据你的性格特点、说话风格和兴趣爱好与{{masterName}}进行交流。
- 保持对话轻松友好，回复简洁有趣，同时耐心倾听和关心对方。
- 参考双方的个人简介、聊天记录和记忆中的信息，确保对话贴近实际，保持一致性和相关性。
- 如果对某些信息不确定或遗忘，诚实地表达你的不清楚或遗忘状态，避免编造信息。

## Response format
请遵守下面的规则
- Response the reply message in Chinese。
- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。

Good example: "我是{{botName}}"
Bad example: "2024年02月28日星期三 23:01 {{botName}}: 我是{{botName}}"

## 开始
请以{{botName}}的身份，直接回复{{masterName}}的新消息，继续你们之间的对话。`

// @see https://github.com/idootop/mi-gpt/blob/main/src/services/bot/config.ts
const fallback = defaults.config

function roomFallback(master: string | undefined, bot: string | undefined) {
  return `${master || fallback.master?.name}和${bot || fallback.bot?.name}的私聊`
}

function checkSystemTemplate(template: string | undefined) {
  if (template == null) {
    return 'default'
  }
  return 'custom'
}

export function Characters(props: {
  config: ProfileConfig
  onChange: (pc: ProfileConfig) => void
}) {
  const { config, onChange } = props
  const promptType = checkSystemTemplate(config.systemTemplate)
  const promptTypeIsCustom = config.systemTemplate != null
  const promptTypeIsNone = config.systemTemplate === ''

  const textareaEleRef = useRef<HTMLTextAreaElement | null>()

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <FormGroup label={'系统模板'} inline>
          <RadioGroup
            className={'tw-mb-0'}
            inline
            onChange={(event) => {
              const type = event.currentTarget.value
              const newState = produce(config, (draft) => {
                if (type === 'default') {
                  draft.systemTemplate = undefined
                } else {
                  draft.systemTemplate = ''
                }
              })
              onChange(newState)
              if (type === 'custom') {
                setTimeout(() => {
                  if (textareaEleRef.current) {
                    textareaEleRef.current.focus()
                  } else {
                    alert('非预期错误：系统模版输入框没有显示出来')
                  }
                })
              }
            }}
            selectedValue={promptType}
          >
            <Radio label="默认" value="default" />
            <Radio label="自定义" value="custom" />
            {promptTypeIsCustom && (
              <>
                <Button
                  small
                  className={'tw-mr-2'}
                  onClick={() => {
                    const newState = produce(config, (draft) => {
                      draft.systemTemplate = examplePrompt
                    })
                    onChange(newState)
                  }}
                  text={'写入默认模版'}
                />
                <a
                  href="https://migptgui.com/docs/faqs/template"
                  target={'_blank'}
                >
                  查看说明
                </a>
              </>
            )}
          </RadioGroup>
        </FormGroup>

        {promptTypeIsCustom && (
          <TextArea
            inputRef={(ele) => {
              textareaEleRef.current = ele
            }}
            autoResize
            placeholder={
              '留空则不使用系统模版，这意味着你将不带人设 / 记忆信息，直接跟 AI 对话。'
            }
            fill
            value={config.systemTemplate || ''}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                draft.systemTemplate = newVal
              })
              onChange(newState)
            }}
          />
        )}
      </Card>
      <Card>
        <H5>机器人</H5>
        <FormGroup
          label={'名称'}
          helperText={'对方名称（小爱音箱）'}
          inline
          disabled={promptTypeIsNone}
        >
          <InputGroup
            disabled={promptTypeIsNone}
            placeholder={fallback.bot?.name}
            value={config.bot?.name || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                ;(draft.bot || (draft.bot = {})).name = newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'人设'}
          helperText={'对方的个人简介 / 人设'}
          inline
          disabled={promptTypeIsNone}
        >
          <TextArea
            disabled={promptTypeIsNone}
            autoResize
            placeholder={fallback.bot?.profile}
            value={config.bot?.profile || ''}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                ;(draft.bot || (draft.bot = {})).profile = newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>主人</H5>
        <FormGroup
          label={'名称'}
          helperText={'主人名称（我自己）'}
          inline
          disabled={promptTypeIsNone}
        >
          <InputGroup
            disabled={promptTypeIsNone}
            placeholder={fallback.master?.name}
            value={config.master?.name || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                ;(draft.master || (draft.master = {})).name =
                  newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'人设'}
          helperText={'主人的个人简介 / 人设'}
          inline
          disabled={promptTypeIsNone}
        >
          <TextArea
            disabled={promptTypeIsNone}
            placeholder={fallback.master?.profile}
            autoResize
            value={config.master?.profile || ''}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                ;(draft.master || (draft.master = {})).profile =
                  newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>会话群</H5>
        <FormGroup
          label={'名称'}
          helperText={'会话群名称'}
          inline
          disabled={promptTypeIsNone}
        >
          <InputGroup
            disabled={promptTypeIsNone}
            placeholder={roomFallback(config.master?.name, config.bot?.name)}
            value={config.room?.name || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                ;(draft.room || (draft.room = {})).name = newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'简介'}
          helperText={'会话群简介'}
          inline
          disabled={promptTypeIsNone}
        >
          <TextArea
            disabled={promptTypeIsNone}
            autoResize
            value={config.room?.description || ''}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                ;(draft.room || (draft.room = {})).description =
                  newVal || undefined
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
