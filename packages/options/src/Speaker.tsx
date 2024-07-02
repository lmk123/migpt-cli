import {
  Card,
  Checkbox,
  Classes,
  FormGroup,
  H5,
  InputGroup,
} from '@blueprintjs/core'
import { produce } from 'immer'
import { LotCommand } from './components/LotCommand.js'
import { MultiInput } from './components/MultiInput.js'
import { NumberText } from './components/NumberText.js'
import { type SpeakerConfig } from './type.js'
import { ChooseSpeaker, speakers } from './components/ChooseSpeaker.js'

interface SpeakerPropsConfig {
  config: {
    speaker: SpeakerConfig
  }
  gui?: {
    speakerModel?: string
  }
}

export function Speaker(props: {
  config: {
    config: {
      speaker: SpeakerConfig
    }
    gui?: {
      speakerModel?: string
    }
  }
  onChange: (config: SpeakerPropsConfig) => void
}) {
  const { config, onChange } = props

  const isSpeakerSelected = !!config.gui?.speakerModel
  const isSpeakerSupport = isSpeakerSelected
    ? !!speakers.find((s) => s.name === config.gui?.speakerModel)?.options
    : true
  const noSupportStream = config.config.speaker.streamResponse === false

  return (
    <div className={'tw-space-y-4'}>
      <FormGroup
        label={'选择你的音箱型号'}
        inline
        helperText={
          isSpeakerSupport ? (
            <>
              根据你选择的型号，将会为你自动填写音箱的部分配置。
              <a
                href="https://migptgui.com/docs/faqs/supports"
                target={'_blank'}
              >
                查看说明
              </a>
            </>
          ) : (
            <>
              此型号不支持使用 MiGPT GUI。
              <a
                href="https://migptgui.com/docs/faqs/supports"
                target={'_blank'}
              >
                查看说明
              </a>
            </>
          )
        }
      >
        <ChooseSpeaker
          value={config.gui?.speakerModel || ''}
          onChange={(speakerName) => {
            const newState = produce(config, (draft) => {
              if (!draft.gui) {
                draft.gui = {}
              }
              draft.gui.speakerModel = speakerName || undefined

              // 不选择，代表用户自己填写
              if (!speakerName) {
                Object.assign(draft.config.speaker, {
                  ttsCommand: undefined,
                  wakeUpCommand: undefined,
                  playingCommand: undefined,
                  streamResponse: undefined,
                })
                return
              }

              const speakerConfig = speakers.find((s) => s.name === speakerName)
              if (speakerConfig) {
                Object.assign(
                  draft.config.speaker,
                  speakerConfig.options || {
                    // 没有 options，表示用户选择的型号不支持 MiGPT GUI
                    ttsCommand: undefined,
                    wakeUpCommand: undefined,
                    playingCommand: undefined,
                    streamResponse: false,
                  },
                )
              } else {
                alert('如果运行到这里，代码肯定出了问题：型号错误')
              }
            })
            onChange(newState)
          }}
        />
      </FormGroup>
      <Card>
        <H5>控制</H5>
        <FormGroup
          inline
          label={'小米账号 ID'}
          helperText={
            <>
              <a
                href="https://account.xiaomi.com/fe/service/account/profile"
                target={'_blank'}
              >
                登录小米账号
              </a>
              后即可看到【小米 ID】。注意：不是手机号或邮箱。
            </>
          }
        >
          <InputGroup
            required
            value={config.config.speaker.userId}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.userId = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup label={'小米账号密码'} inline>
          <InputGroup
            required
            type={'password'}
            value={config.config.speaker.password}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.password = newVal
              })
              onChange(newState)
            }}
          ></InputGroup>
        </FormGroup>
        <FormGroup
          inline
          label={'设备 ID'}
          helperText={
            '小爱音箱 ID 或名称。填写你通过小爱音箱 APP 连接音箱时设置的名称即可，例如“小爱音箱Pro”。'
          }
        >
          <InputGroup
            required
            value={config.config.speaker.did || ''}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.did = newVal
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'播放命令'}
          inline
          helperText={isSpeakerSelected ? '已根据你选择的型号自动填写。' : ''}
        >
          <LotCommand
            disabled={isSpeakerSelected}
            required
            value={config.config.speaker.ttsCommand}
            count={2}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.ttsCommand = value
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'唤醒命令'}
          inline
          helperText={isSpeakerSelected ? '已根据你选择的型号自动填写。' : ''}
        >
          <LotCommand
            disabled={isSpeakerSelected}
            required
            value={config.config.speaker.wakeUpCommand}
            count={2}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.wakeUpCommand = value
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'播放检测命令'}
          inline
          helperText={isSpeakerSelected ? '已根据你选择的型号自动填写。' : ''}
        >
          <LotCommand
            disabled={isSpeakerSelected}
            value={config.config.speaker.playingCommand}
            count={3}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.playingCommand = value
              })
              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>

      <Card>
        <H5>单次对话</H5>
        <p className={Classes.TEXT_MUTED + ' ' + Classes.TEXT_SMALL}>
          “单次对话”的说明见：
          <a href="https://migptgui.com/docs/faqs/wakeup" target={'_blank'}>
            如何调用 AI 进行回答？
          </a>
        </p>
        <FormGroup label={'调用 AI 关键词'} inline>
          <MultiInput
            value={config.config.speaker.callAIKeywords}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.callAIKeywords = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>

      <Card>
        <H5>连续对话（唤醒模式）</H5>
        <p className={Classes.TEXT_MUTED + ' ' + Classes.TEXT_SMALL}>
          “连续对话”的说明见：
          <a href="https://migptgui.com/docs/faqs/wakeup" target={'_blank'}>
            如何调用 AI 进行回答？
          </a>
        </p>
        <FormGroup
          label={'是否启用'}
          helperText={
            isSpeakerSelected ? '已根据你选择的型号自动填写。' : undefined
          }
          inline
        >
          <Checkbox
            disabled={isSpeakerSelected}
            checked={
              config.config.speaker.streamResponse == null
                ? true
                : config.config.speaker.streamResponse
            }
            onChange={(event) => {
              const newVal = event.target.checked
              const newState = produce(config, (draft) => {
                draft.config.speaker.streamResponse = newVal ? undefined : false
              })
              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'唤醒关键词'}
          helperText={
            '当消息以关键词开头时，会进入 AI 唤醒状态。AI 唤醒状态下，可以跟 AI 连续对话。'
          }
          inline
          disabled={noSupportStream}
        >
          <MultiInput
            disabled={noSupportStream}
            value={config.config.speaker.wakeUpKeywords}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.wakeUpKeywords = value
              })
              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'退出关键词'}
          helperText={'当消息以关键词开头时，会退出 AI 唤醒状态。'}
          inline
          disabled={noSupportStream}
        >
          <MultiInput
            disabled={noSupportStream}
            value={config.config.speaker.exitKeywords}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.exitKeywords = value
              })
              onChange(newState)
            }}
          />
        </FormGroup>
        <FormGroup
          label={'自动退出时间'}
          helperText={'连续对话时，无响应多久后自动退出。'}
          inline
          disabled={noSupportStream}
        >
          <NumberText
            disabled={noSupportStream}
            placeholder={'30'}
            value={
              config.config.speaker.exitKeepAliveAfter == null
                ? null
                : config.config.speaker.exitKeepAliveAfter
            }
            min={1}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.exitKeepAliveAfter =
                  newVal == null ? undefined : newVal
              })
              onChange(newState)
            }}
            rightElement={
              <span className="tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2">
                秒
              </span>
            }
          />
        </FormGroup>
        <FormGroup
          disabled={noSupportStream}
          label={'检测 1'}
          helperText={
            '连续对话时，播放状态检测间隔。调小此值可以降低小爱回复之间的停顿感，请酌情调节'
          }
          inline
        >
          <NumberText
            disabled={noSupportStream}
            placeholder={'1000'}
            value={
              config.config.speaker.checkInterval == null
                ? null
                : config.config.speaker.checkInterval
            }
            min={500}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.checkInterval =
                  newVal == null ? undefined : newVal
              })
              onChange(newState)
            }}
            rightElement={
              <span className="tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2">
                毫秒
              </span>
            }
          />
        </FormGroup>
        <FormGroup
          disabled={noSupportStream}
          label={'检测 2'}
          helperText={
            '连续对话时，下发 TTS 指令多长时间后开始检测设备播放状态。最好不要低于 1 秒。）'
          }
          inline
        >
          <NumberText
            disabled={noSupportStream}
            placeholder={'3'}
            value={
              config.config.speaker.checkTTSStatusAfter == null
                ? null
                : config.config.speaker.checkTTSStatusAfter
            }
            min={1}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.checkTTSStatusAfter =
                  newVal == null ? undefined : newVal
              })

              onChange(newState)
            }}
            rightElement={
              <span className="tw-inline-block tw-h-[28px] tw-leading-[28px] tw-pr-2">
                秒
              </span>
            }
          />
        </FormGroup>
      </Card>

      <Card>
        <H5>提示语</H5>

        <FormGroup
          label={'进入 AI'}
          helperText={'进入 AI 唤醒模式时的提示语。'}
          inline
        >
          <MultiInput
            value={config.config.speaker.onEnterAI}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.onEnterAI = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'退出 AI'}
          helperText={'退出 AI 唤醒模式时的提示语。'}
          inline
        >
          <MultiInput
            value={config.config.speaker.onExitAI}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.onExitAI = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 思考中'}
          helperText={'AI 开始回答时的提示语。'}
          inline
        >
          <MultiInput
            value={config.config.speaker.onAIAsking}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.onAIAsking = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 回答完毕'}
          helperText={'AI 结束回答时的提示语。'}
          inline
        >
          <MultiInput
            value={config.config.speaker.onAIReplied}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.onAIReplied = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 出错'}
          helperText={'AI 回答异常时的提示语。'}
          inline
        >
          <MultiInput
            value={config.config.speaker.onAIError}
            onChange={(value) => {
              const newState = produce(config, (draft) => {
                draft.config.speaker.onAIError = value
              })

              onChange(newState)
            }}
          />
        </FormGroup>
      </Card>
    </div>
  )
}
