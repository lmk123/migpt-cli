# migpt-cli

通过命令行的方式使用 [MiGPT](https://github.com/idootop/mi-gpt/)。

- 在网页上即可编辑配置，支持导入 / 导出，并且支持运行 MiGPT。
- 也可以通过命令行的方式创建不同的机器人配置并运行 MiGPT。

具体使用方式见 [https://migptgui.com](https://migptgui.com/)。

## 机器人的“记忆”

假设你在桌面上创建了一个机器人 `robot_A`，目录结构就像下面这样：

```
~/Desktop/
└── robot_A/
    └── migpt.json
```

那么，当你首次运行 `npx migpt-cli run robot_A` 时，机器人会在 `robot_A` 文件夹下生成两个文件 `.bot.json` 和 `.mi.json`，用来存储机器人的“记忆”，目录结构就像下面这样：

```
~/Desktop/
└── robot_A/
    ├── .bot.json
    ├── .mi.json
    └── migpt.json
```

> 实际上对话内容不是存储在 `.bot.json` 和 `.mi.json` 中，而是存储在一个统一的数据库中，这里为了便于理解才这么说。更多细节请参考 [idootop/mi-gpt#114](https://github.com/idootop/mi-gpt/issues/114)。

之后你每次运行 `npx migpt-cli run robot_A` 时，你跟机器人之间的“记忆”都会保存到这两个文件当中。换句话说，无论你怎么修改 `robot_A/migpt.json` 的配置，机器人都会保留之前的人设，直到你删除 `.bot.json` 和 `.mi.json`。

建议使用文件夹来隔离不同的机器人。如果不需要某个机器人了，直接删除对应的文件夹即可，就像下面这样：

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
