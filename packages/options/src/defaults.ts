import { type WholeConfig } from './type'

export const defaults: WholeConfig = {
  config: {
    systemTemplate: '',
    bot: {
      name: '傻妞',
      profile: '性别女，性格乖巧可爱，喜欢搞怪，爱吃醋。',
    },
    master: {
      name: '陆小千',
      profile: '性别男，善良正直，总是舍己为人，是傻妞的主人。',
    },
    room: {
      name: '魔幻手机',
      description: '傻妞和陆小千的私聊',
    },
    speaker: {
      // userId: '',
      // password: '',
      // did: '',
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
    },
  },
  env: {},
}
