# migpt-cli

通过命令行的方式使用 [MiGPT](https://github.com/idootop/mi-gpt/)。

## 安装

1. 安装 Node.js。
2. 在终端中运行 `npx migpt-cli init`，这个命令会生成一个示例配置文件 migpt.json。
    - 第一次运行时，会提示你要不要安装 `migpt-cli`，直接按回车键即可。
3. 使用文本编辑器或者其它工具编辑 migpt.json。配置项说明请参考 [MiGPT 参数配置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md)。
4. 完成编辑后，在终端中运行 `npx migpt-cli`。

## 机器人的“记忆”

假设你在桌面上新建了一个文件夹 `robot_A`，然后在里面运行 `npx migpt-cli init`，生成的配置文件是 `robot_A/migpt.json`，目录结构就像下面这样：

```
~/Desktop/
└── robot_A/
    └── migpt.json
```

那么，当你首次运行 `npx migpt-cli` 时，机器人会在 `robot_A` 文件夹下生成两个文件 `.bot.json` 和 `.mi.json`，用来存储机器人的“记忆”，目录结构就像下面这样：

```
~/Desktop/
└── robot_A/
    ├── .bot.json
    ├── .mi.json
    └── migpt.json
```

之后你每次运行 `npx migpt-cli` 时，你跟机器人之间的“记忆”都会保存到这两个文件当中。换句话说，无论你怎么修改 `robot_A/migpt.json` 的配置，机器人都会记住你的对话历史，直到你删除 `.bot.json` 和 `.mi.json`。

建议使用文件夹来隔离不同的机器人，如果不需要某个机器人了，直接删除对应的文件夹即可，就像下面这样：

```
~/Desktop/
├── robot_A/
│   ├── .bot.json
│   ├── .mi.json
│   └── migpt.json
└── robot_B/
    ├── .bot.json
    ├── .mi.json
    └── migpt.json
```

