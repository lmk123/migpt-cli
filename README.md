# migpt-cli

通过命令行的方式使用 [MiGPT](https://github.com/idootop/mi-gpt/)。

- 在网页上即可编辑配置，支持导入 / 导出，并且支持运行 MiGPT。
- 也可以通过命令行的方式创建不同的机器人配置并运行 MiGPT。

## （推荐）在网页上编辑配置并运行 MiGPT

1. 安装 Node.js。
2. 在终端中运行 `npx -y migpt-cli server`，这条命令会自动打开一个网址。
3. 在网址中对配置进行编辑，完成编辑后，点击【启动】。
   - 配置项说明请参考 [MiGPT 参数配置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md)。

同时还支持【停止】/【导出】/【导入】功能。

目前位置还不支持通过网页的方式保存并运行多个机器人配置，此功能会在下一个版本中支持。

## 通过命令行创建机器人并运行 MiGPT

1. 安装 Node.js。
2. 在终端中运行 `npx -y migpt-cli create myfirstbot`，这个命令会生成一个名为 `myfirstbot` 的文件夹，里面会有一个示例配置文件 migpt.json。
    - 你可以把其中的 `myfirstbot` 替换成你想要的名字，但要注意后面的步骤中也要把 `myfirstbot` 替换成你的名字。
3. 在终端中运行 `npx -y migpt-cli server`，这条命令会自动打开一个网址，在此网址中填写好配置，然后点击【导出】，会有一个 migpt.json 文件自动下载到你的电脑中。
    - 配置项说明请参考 [MiGPT 参数配置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md)。
4. 将下载的 migpt.json 文件覆盖 `myfirstbot` 文件夹中的 migpt.json 文件。
5. 在终端中运行 `npx -y migpt-cli run myfirstbot`。
6. 当你不再需要这个机器人时，直接删除 `myfirstbot` 文件夹即可。

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
