import { MiGPTConfig } from 'mi-gpt'

export type SpeakerConfig = Omit<
  Partial<MiGPTConfig['speaker']>,
  'ttsCommand' | 'wakeUpCommand' | 'playingCommand' | 'tts'
> & {
  // 重写一些字段的类型，以适用于网页中的情况。
  // 举例，MiGPTConfig 里给 `speaker.tts` 的类型是 `TTSProvider`，但在网页当中，input 输入框的类型是 string。
  tts?: string
  ttsCommand?: (number | undefined)[]
  wakeUpCommand?: (number | undefined)[]
  playingCommand?: (number | undefined)[]
}

export interface WholeConfig {
  /**
   * MiGPT 的配置
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#migptjs
   */
  config: {
    systemTemplate: MiGPTConfig['systemTemplate']
    master: NonNullable<MiGPTConfig['master']>
    bot: NonNullable<MiGPTConfig['bot']>
    room: NonNullable<MiGPTConfig['room']>
    speaker: SpeakerConfig
  }
  /**
   * 运行 MiGPT 所需的环境变量
   * @see https://github.com/idootop/mi-gpt/blob/main/docs/settings.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
   */
  env: {
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
}
