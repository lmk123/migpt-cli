给自己的另一个项目打个广告：划词翻译，一站式划词 / 截图 / 网页全文 / 音视频 AI 翻译扩展，[点击查看简介](https://hcfy.ai/docs/guides/summary)

-------------------

# MiGPT GUI

为 [MiGPT](https://github.com/idootop/mi-gpt/) 提供图形化操作界面。

特点：

- 使用图形化界面的方式编辑配置并控制（比如启动 / 停止 / 重置）MiGPT
- 内置 [MiGPT TTS](https://github.com/idootop/mi-gpt-tts)，所以无需你自己额外部署
- 提供在公网运行所需的安全功能：
    - 提供登录认证功能，你可以设置账号密码，确保只有你自己能够控制你的 MiGPT
    - 内置的 MiGPT TTS 始终启用了[秘密路径](https://github.com/idootop/mi-gpt-tts/blob/main/docs/mi-gpt.md#2-%E9%85%8D%E7%BD%AE%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)，且会自动下发给 MiGPT，对你是无感知的，你也不需要知道这个概念
    - 可以修改运行的端口号，避免被精准扫描

具体使用方式见 [https://migptgui.com](https://migptgui.com/)。
