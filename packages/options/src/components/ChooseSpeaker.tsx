import { HTMLSelect } from '@blueprintjs/core'

interface SpeakerInfo {
  name: string
  options: {
    ttsCommand: number[]
    wakeUpCommand: number[]
    playingCommand: number[] | undefined
    streamResponse: boolean | undefined
  } | null
}

const speakersPerfect: SpeakerInfo[] = [
  {
    name: 'Xiaomi 智能音箱 Pro',
    options: {
      ttsCommand: [7, 3],
      wakeUpCommand: [7, 1],
      playingCommand: undefined,
      streamResponse: undefined,
    },
  },
  {
    name: '小爱音箱 Pro',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 3],
      playingCommand: undefined,
      streamResponse: undefined,
    },
  },
  {
    name: '小爱音箱 mini',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 2],
      playingCommand: [4, 1, 1],
      streamResponse: undefined,
    },
  },
  {
    name: '小爱音箱 Play（2019 款）',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 3],
      playingCommand: [3, 1, 1],
      streamResponse: undefined,
    },
  },
  {
    name: '小爱音箱 万能遥控版',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 3],
      playingCommand: undefined,
      streamResponse: undefined,
    },
  },
  {
    name: '小米 AI 音箱',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 3],
      playingCommand: undefined,
      streamResponse: undefined,
    },
  },
  {
    name: '小米 AI 音箱（第二代）',
    options: {
      ttsCommand: [7, 3],
      wakeUpCommand: [7, 1],
      playingCommand: [3, 1, 1],
      streamResponse: undefined,
    },
  },
  {
    name: '小爱智能家庭屏 10',
    options: {
      ttsCommand: [7, 3],
      wakeUpCommand: [7, 1],
      playingCommand: undefined,
      streamResponse: undefined,
    },
  },
]

const speakersNormal: SpeakerInfo[] = [
  {
    name: '小爱音箱',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 2],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: '小爱音箱 Play',
    options: {
      ttsCommand: [5, 3],
      wakeUpCommand: [5, 1],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: '小米小爱音箱 Play 增强版',
    options: {
      ttsCommand: [5, 3],
      wakeUpCommand: [5, 1],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: 'Xiaomi 智能家庭屏 6',
    options: {
      ttsCommand: [7, 3],
      wakeUpCommand: [7, 1],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: 'Redmi 小爱触屏音箱 Pro 8 英寸',
    options: {
      ttsCommand: [7, 3],
      wakeUpCommand: [7, 1],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: '小爱音箱 Art',
    options: {
      ttsCommand: [3, 1],
      wakeUpCommand: [3, 2],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
  {
    name: '小爱触屏音箱',
    options: {
      ttsCommand: [5, 1],
      wakeUpCommand: [5, 2],
      playingCommand: undefined,
      streamResponse: false,
    },
  },
]

const speakersNotSupport: SpeakerInfo[] = [
  {
    name: '小米小爱音箱 HD',
    options: null,
  },
  {
    name: '小米小爱蓝牙音箱随身版',
    options: null,
  },
]

// @see https://migptgui.com/docs/faqs/supports
export const speakers = [
  ...speakersPerfect,
  ...speakersNormal,
  ...speakersNotSupport,
]

export function ChooseSpeaker(props: {
  value: string | null
  onChange: (speakerName: string | null) => void
}) {
  return (
    <HTMLSelect
      value={props.value || ''}
      onChange={(e) => {
        props.onChange(e.target.value || null)
      }}
    >
      <option value="">自定义</option>
      <optgroup label={'支持连续对话'}>
        {speakersPerfect.map((speaker) => (
          <option key={speaker.name} value={speaker.name}>
            {speaker.name}
          </option>
        ))}
      </optgroup>
      <optgroup label={'不支持连续对话'}>
        {speakersNormal.map((speaker) => (
          <option key={speaker.name} value={speaker.name}>
            {speaker.name}
          </option>
        ))}
      </optgroup>
      <optgroup label={'无法运行'}>
        {speakersNotSupport.map((speaker) => (
          <option key={speaker.name} value={speaker.name}>
            {speaker.name}
          </option>
        ))}
      </optgroup>
    </HTMLSelect>
  )
}
