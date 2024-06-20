# migpt-cli

通过命令行的方式使用 [MiGPT](https://github.com/idootop/mi-gpt/)。

## 安装

1. 安装 Node.js。
2. 准备一个配置文件 migpt.json。具体配置项见下文。
3. 在终端中打开 migpt.json 所在的目录，然后运行 `npx migpt-cli`。
   - 举个例子，假设你的 migpt.json 在桌面，也就是 `~/Desktop/migpt.json`，那么你需要在终端中运行 `cd ~/desktop`，然后再运行 `npx migpt-cli`。

migpt-cli 默认会读取当前工作目录下的 `migpt.json` 文件。你也可以通过 `--config` 参数指定配置文件的路径。

```bash
npx migpt-cli --config /path/to/my-migpt.json
```

### migpt.json 结构

配置文件的参数其实就是 MiGPT 在这里的配置项：[参数配置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md)。

以下是一个示例：

```json
{
  "config": {
    "systemTemplate": "",
    "bot": {
      "name": "曹操",
      "profile": "你是《三国演义》里的曹操。"
    },
    "master": {
      "name": "刘备",
      "profile": "《三国演义》里的刘备。"
    },
    "room": {
      "name": "三国",
      "description": "三国演义里的世界"
    },
    "speaker": {
      "userId": "12345678",
      "password": "your_password",
      "did": "小爱音箱Pro",
      "ttsCommand": [5, 1],
      "wakeUpCommand": [5, 3],
      "callAIKeywords": ["fdsfesdf随便填写免得被唤醒fsdf"],
      "wakeUpKeywords": ["把曹操"],
      "exitKeywords": ["退下"],
      "onEnterAI": ["进入"],
      "onAIAsking": ["思考中"],
      "onAIReplied": ["已回答"],
      "onExitAI": ["退出"],
      "exitKeepAliveAfter": 60,
      "streamResponse": true,
      "checkInterval": 1000
    }
  },
  "env": {
    "OPENAI_API_KEY": "xxxxxxx-xxxxxxx-xxxxxxx-xxxxxxx",
    "OPENAI_MODEL": "gpt-3.5-turbo",
    "OPENAI_BASE_URL": "https://aaaa.bbbbb.com/api/v1",
    "AZURE_OPENAI_API_KEY": "",
    "AUDIO_SILENT": "",
    "AUDIO_BEEP": "",
    "AUDIO_ACTIVE": "",
    "AUDIO_ERROR": "",
    "TTS_BASE_URL": ""
  }
}
```
