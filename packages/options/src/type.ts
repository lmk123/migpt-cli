import { type MiGPTConfig } from 'mi-gpt'
import { type TTSConfig } from 'mi-gpt-tts'

export type SpeakerConfig = Omit<
  MiGPTConfig['speaker'],
  'ttsCommand' | 'wakeUpCommand' | 'playingCommand' | 'tts'
> & {
  // 重写一些字段的类型，以适用于网页中的情况。
  // 举例，MiGPTConfig 里给 `speaker.tts` 的类型是 `TTSProvider`，但在网页当中，input 输入框的类型是 string。
  tts?: string
  ttsCommand?: (number | undefined)[]
  wakeUpCommand?: (number | undefined)[]
  playingCommand?: (number | undefined)[]
}

export interface GuiConfig {
  /**
   * MiGPT 的配置
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#migptjs
   */
  config: Pick<MiGPTConfig, 'systemTemplate' | 'master' | 'bot' | 'room'> & {
    speaker: SpeakerConfig
  }
  /**
   * 运行 MiGPT 所需的环境变量
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
   */
  env: {
    OPENAI_API_KEY: string
    OPENAI_MODEL: string
    OPENAI_BASE_URL: string
    AZURE_OPENAI_API_KEY?: string
    AUDIO_SILENT?: string
    AUDIO_BEEP?: string
    AUDIO_ACTIVE?: string
    AUDIO_ERROR?: string
    TTS_BASE_URL?: string
  }

  // MiGPT TTS 的配置
  tts?: TTSConfig

  // MiGPT GUI 自身所需的配置
  gui?: {
    /**
     * 内建 TTS 服务的提供者，比如火山是 "volcano"
     */
    ttsProvider?: string
    /**
     * 运行 migpt-server 的设备的局域网或公网 IP 地址
     */
    publicIP?: string
    /**
     * 端口号
     */
    port?: number
    /**
     * 小爱音箱的型号，比如 "小米 AI 音箱（第二代）"
     */
    speakerModel?: string
  }
}
