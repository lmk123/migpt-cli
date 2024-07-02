import { GuiConfig } from './type'

export const defaults: GuiConfig = {
  config: {
    bot: {
      name: '傻妞',
      profile: `性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。`,
    },
    master: {
      name: '陆小千',
      profile: `性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。`,
    },
    // 默认值
    // @see https://github.com/idootop/mi-gpt/blob/main/src/services/speaker/ai.ts
    speaker: {
      userId: '',
      password: '',
      switchSpeakerKeywords: ['把声音换成'],
      callAIKeywords: ['请', '你', '傻妞'],
      wakeUpKeywords: ['打开', '进入', '召唤'],
      exitKeywords: ['关闭', '退出', '再见'],
      onEnterAI: ['你好，我是傻妞，很高兴认识你'],
      onExitAI: ['傻妞已退出'],
      onAIAsking: ['让我先想想', '请稍等'],
      onAIReplied: ['我说完了', '还有其他问题吗'],
      onAIError: ['啊哦，出错了，请稍后再试吧！'],
    },
  },
  env: {
    OPENAI_BASE_URL: '',
    OPENAI_API_KEY: '',
    OPENAI_MODEL: '',
  },
}
