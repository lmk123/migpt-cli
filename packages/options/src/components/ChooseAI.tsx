import { HTMLSelect } from '@blueprintjs/core'

interface AIInfo {
  name: string
  urlDocs: string
  urlAPI: string
  models?: string[]
}

export const ais: AIInfo[] = [
  {
    name: 'OpenAI (ChatGPT)',
    urlDocs: 'https://migptgui.com/docs/apply/chatgpt',
    urlAPI: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4o'],
  },
  {
    name: '智谱 AI',
    urlDocs: 'https://migptgui.com/docs/apply/zhipu',
    urlAPI: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4-flash', 'glm-4-air', 'glm-4-airx'],
  },
  {
    name: '豆包',
    urlDocs: 'https://migptgui.com/docs/apply/doubao',
    urlAPI: 'https://ark.cn-beijing.volces.com/api/v3',
  },
  {
    name: '通义千问',
    urlDocs: 'https://migptgui.com/docs/apply/tongyi',
    urlAPI: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-long', 'qwen-turbo', 'qwen-plus'],
  },
  {
    name: 'DeepSeek',
    urlDocs: 'https://migptgui.com/docs/apply/deepseek',
    urlAPI: 'https://api.deepseek.com',
    models: ['deepseek-chat'],
  },
  {
    name: '零一万物（万知）',
    urlDocs: 'https://migptgui.com/docs/apply/lingyi',
    urlAPI: 'https://api.lingyiwanwu.com/v1',
    models: ['yi-medium', 'yi-large-turbo', 'yi-large'],
  },
  {
    name: '百川智能（百小应）',
    urlDocs: 'https://migptgui.com/docs/apply/baichuan',
    urlAPI: 'https://api.baichuan-ai.com/v1',
    models: ['baichuan2-turbo', 'baichuan3-turbo', 'baichuan4'],
  },
  {
    name: 'Moonshot (Kimi)',
    urlDocs: 'https://migptgui.com/docs/apply/moonshot',
    urlAPI: 'https://api.moonshot.cn/v1',
    models: ['moonshot-v1-8k'],
  },
]

export function ChooseAI(props: {
  value: string | null
  onChange: (name: string | null) => void
}) {
  return (
    <HTMLSelect
      value={props.value || ''}
      onChange={(e) => {
        props.onChange(e.target.value || null)
      }}
    >
      <option value="">自定义</option>
      {ais.map((info) => (
        <option key={info.name} value={info.name}>
          {info.name}
        </option>
      ))}
    </HTMLSelect>
  )
}
