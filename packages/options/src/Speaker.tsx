import { MiGPTConfig } from 'mi-gpt'
import { useEffect, useState } from 'react'
import { Card, Checkbox, FormGroup, H5, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'
import { LotCommand } from './components/LotCommand'
import { MultiInput } from './components/MultiInput'
import { NumberText } from './components/NumberText'

type SpeakerConfig = Omit<
  MiGPTConfig['speaker'],
  'ttsCommand' | 'wakeUpCommand' | 'playingCommand' | 'tts'
> & {
  tts?: string
  ttsCommand?: (number | undefined)[]
  wakeUpCommand?: (number | undefined)[]
  playingCommand?: (number | undefined)[]
}

const defaultConfig: SpeakerConfig = {
  userId: '',
  password: '',
  did: '',
  // ttsCommand: [],
  // wakeUpCommand: [],
  tts: 'xiaoai',
  switchSpeakerKeywords: ['把声音换成'],
  callAIKeywords: ['请', '傻妞'],
  wakeUpKeywords: ['召唤傻妞', '打开傻妞'],
  exitKeywords: ['退出傻妞', '关闭傻妞'],
  onEnterAI: ['你好，我是傻妞，很高兴认识你'],
  onExitAI: ['傻妞已退出'],
  onAIAsking: ['让我先想想', '请稍等'],
  onAIReplied: ['我说完了', '还有其他问题吗'],
  onAIError: ['出错了，请稍后再试吧！'],
  streamResponse: true,
  exitKeepAliveAfter: 30,
  checkInterval: 1000,
  checkTTSStatusAfter: 3,
}

export function Speaker(props: {
  config?: SpeakerConfig
  onChange: (config: SpeakerConfig) => void
}) {
  const { config = defaultConfig, onChange } = props

  const [innerConfig, setInnerConfig] = useState(config || defaultConfig)

  useEffect(() => {
    setInnerConfig(config)
  }, [config])

  return (
    <div className={'tw-space-y-4'}>
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
            value={innerConfig.userId}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.userId = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'小米账号密码'} inline>
          <InputGroup
            required
            type={'password'}
            value={innerConfig.password}
            onChange={(event) => {
              const newVal = event.target.value
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.password = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
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
            value={innerConfig.did}
            onChange={(event) => {
              const newVal = event.target.value

              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.did = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'TTS 命令'} inline>
          <LotCommand
            required
            value={innerConfig.ttsCommand}
            count={2}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.ttsCommand = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'唤醒命令'} inline>
          <LotCommand
            required
            value={innerConfig.wakeUpCommand}
            count={2}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.wakeUpCommand = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup label={'播放命令'} inline>
          <LotCommand
            value={innerConfig.playingCommand}
            count={3}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.playingCommand = value
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
        <H5>连续对话（唤醒模式）</H5>
        <FormGroup
          label={'连续对话'}
          helperText={
            '部分小爱音箱型号无法查询到正确的播放状态，需要关闭连续对话。'
          }
          inline
        >
          <Checkbox
            checked={innerConfig.streamResponse}
            onChange={(event) => {
              const newVal = event.target.checked
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.streamResponse = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'唤醒关键词'}
          helperText={
            '当消息以关键词开头时，会进入 AI 唤醒状态。AI 唤醒状态下，可以跟 AI 连续对话。'
          }
          inline
        >
          <MultiInput
            value={innerConfig.wakeUpKeywords}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.wakeUpKeywords = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'退出关键词'}
          helperText={'当消息以关键词开头时，会退出 AI 唤醒状态。'}
          inline
        >
          <MultiInput
            value={innerConfig.exitKeywords}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.exitKeywords = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup
          label={'自动退出时间'}
          helperText={'连续对话时，无响应多久后自动退出。单位：秒。'}
          inline
        >
          <NumberText
            required
            value={
              innerConfig.exitKeepAliveAfter == null
                ? null
                : innerConfig.exitKeepAliveAfter
            }
            min={1}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.exitKeepAliveAfter = newVal == null ? undefined : newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup
          label={'检测 1'}
          helperText={
            '连续对话时，播放状态检测间隔（单位：毫秒）。调小此值可以降低小爱回复之间的停顿感，请酌情调节'
          }
          inline
        >
          <NumberText
            required
            value={
              innerConfig.checkInterval == null
                ? null
                : innerConfig.checkInterval
            }
            min={500}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.checkInterval = newVal == null ? undefined : newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>
        <FormGroup
          label={'检测 2'}
          helperText={
            '连续对话时，下发 TTS 指令多长时间后开始检测设备播放状态（单位：秒）。最好不要低于 1 秒。）'
          }
          inline
        >
          <NumberText
            required
            value={
              innerConfig.checkTTSStatusAfter == null
                ? null
                : innerConfig.checkTTSStatusAfter
            }
            min={1}
            pattern={'\\d+'}
            onValueChange={(newVal) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.checkTTSStatusAfter =
                    newVal == null ? undefined : newVal
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
        <H5>关键词</H5>
        <FormGroup
          label={'调用 AI 关键词（单次）'}
          helperText={'当消息以关键词开头时，会调用 AI 来响应用户消息。'}
          inline
        >
          <MultiInput
            value={innerConfig.callAIKeywords}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.callAIKeywords = value
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
        <H5>提示语</H5>

        <FormGroup
          label={'进入 AI'}
          helperText={'进入 AI 唤醒模式时的提示语。'}
          inline
        >
          <MultiInput
            value={innerConfig.onEnterAI}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.onEnterAI = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'退出 AI'}
          helperText={'退出 AI 唤醒模式时的提示语。'}
          inline
        >
          <MultiInput
            value={innerConfig.onExitAI}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.onExitAI = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 思考中'}
          helperText={'AI 开始回答时的提示语。'}
          inline
        >
          <MultiInput
            value={innerConfig.onAIAsking}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.onAIAsking = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 回答完毕'}
          helperText={'AI 结束回答时的提示语。'}
          inline
        >
          <MultiInput
            value={innerConfig.onAIReplied}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.onAIReplied = value
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'AI 出错'}
          helperText={'AI 回答异常时的提示语。'}
          inline
        >
          <MultiInput
            value={innerConfig.onAIError}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.onAIError = value
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
        <H5>其它</H5>
        <FormGroup label={'TTS 引擎'} inline>
          <InputGroup
            required
            value={innerConfig.tts}
            onValueChange={(newVal) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.tts = newVal
                })

                setTimeout(() => {
                  onChange(newState)
                })
                return newState
              })
            }}
          />
        </FormGroup>

        <FormGroup
          label={'切换音色关键词'}
          helperText={'只有配置了第三方 TTS 引擎时才有效'}
          inline
        >
          <MultiInput
            value={innerConfig.switchSpeakerKeywords}
            onChange={(value) => {
              setInnerConfig((prevState) => {
                const newState = produce(prevState, (draft) => {
                  draft.switchSpeakerKeywords = value
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
