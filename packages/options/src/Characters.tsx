import {
  Button,
  Card,
  FormGroup,
  H5,
  InputGroup,
  TextArea,
} from '@blueprintjs/core'
import { produce } from 'immer'
import { WholeConfig } from './type'

type ProfileConfig = Pick<
  WholeConfig['config'],
  'systemTemplate' | 'master' | 'room' | 'bot'
>

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

export function Characters(props: {
  config: ProfileConfig
  onChange: (pc: ProfileConfig) => void
}) {
  const { config, onChange } = props

  return (
    <div className={'tw-space-y-4'}>
      <Card>
        <H5>机器人</H5>
        <FormGroup label={'名称'} helperText={'对方名称（小爱音箱）'} inline>
          <InputGroup
            required
            value={config.bot.name}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.bot.name = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'人设'} helperText={'对方的个人简介 / 人设'} inline>
          <TextArea
            autoResize
            required
            value={config.bot.profile}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                draft.bot.profile = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>主人</H5>
        <FormGroup label={'名称'} helperText={'主人名称（我自己）'} inline>
          <InputGroup
            required
            value={config.master.name}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.master.name = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'人设'} helperText={'主人的个人简介 / 人设'} inline>
          <TextArea
            required
            autoResize
            value={config.master.profile}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                draft.master.profile = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>会话群</H5>
        <FormGroup label={'名称'} helperText={'会话群名称'} inline>
          <InputGroup
            required
            value={config.room.name}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.room.name = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'简介'} helperText={'会话群简介'} inline>
          <TextArea
            required
            autoResize
            value={config.room.description}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                draft.room.description = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
      <Card>
        <H5>
          自定义 prompt 模版{' '}
          <Button
            onClick={() => {
              const newState = produce(config, (draft) => {
                draft.systemTemplate = examplePrompt
              })
              onChange(newState)
            }}
            text={'写入默认模版'}
          />
        </H5>
        <FormGroup>
          <TextArea
            autoResize
            fill
            value={config.systemTemplate}
            onChange={(event) => {
              const newVal = event.target.value
              const newState = produce(config, (draft) => {
                draft.systemTemplate = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
