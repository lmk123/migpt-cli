# 划词翻译

新的划词翻译源码仓库，使用了 monorepos 的方式组织代码，目前已将[划词翻译扩展程序](https://github.com/hcfyapp/highlight-translator-pro)的代码迁移进来了。

## 开发流程

一次性准备工作：

1. 运行 `nvm use`。这会确保使用的是项目兼容的 Node.js 版本，在 .nvmrc 可以查看当前使用的版本。
2. 运行 `npm ci` 安装依赖。你可以运行 `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci` 跳过下载 Electron 的步骤（例如在 CI 或者 Windows Ubuntu 环境中）。
3. 运行 `npm run genLangMap -w apps/browser-extension` 为划词翻译扩展程序项目生成语种文件。

然后，运行 `npm run dev:extension` 就可以启动划词翻译扩展程序项目的开发模式了。

更多命令和注意事项可以参考根目录与各项目的 package.json 和 README.md。

## 一些项目方面的 TODOs

- build 里查找模块的路径全都用 require.resolve 来确定，这样既能在 workspace 里用，以后项目单独拆分出来了也能用。示例见 _packages/pdf-viewer/README.md_
- undici 不能升级到 v6 版本，否则 mswjs v2 会报错，https://github.com/mswjs/msw/issues/1916
    - 换成 mswjs v1 好了，v2 真的是一点也不考虑支持 jest

## 注意事项

### 关于包名前缀 `@hcfyapp` 和 `@hcfy`

默认情况下，应该使用 `@hcfyapp` 作为包名前缀，这表示这个包是项目内私有的，没有发布到 NPM。同时，package.json 的 private 属性需要设为 true。

但是，有几个包是发布到了 NPM 的，它们会以 `@hcfy` 作为包名前缀。这些包需要注意不要引用私有包（即 `@hcfyapp` 开头的包）。

### 项目默认使用了 react 的新 jsx transform

在 tsconfig.base.json 里，我配置了 `jsx: react-jsxdev`，见 [React 官方对新 jsx transform 的介绍](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。

但是，在 build 生产环境代码的时候，需要把这个选项改为 `jsx: react-jsx`，比如 rollup 会在 ts 插件里改；使用 babel 来转译 ts 代码的项目会使用 babel/preset-react 插件来做这件事，如 browser-extension。

### 关于 es6 模块

需要确保用 typescript 输出后的 .mjs / .cjs / .js 文件内在导入模块时带上了文件名后缀。举例来说，`import get from 'lodash/get'` 必须改成 `import get from 'lodash/get.js'`，注意后面多了 .js。

因为按照 es6 的模块标准，导入文件时就是需要带上后缀的。如果不带的话，webpack 会报错。虽然 webpack 可以用 [fullySpecify: false](https://webpack.js.org/configuration/module/#resolvefullyspecified) 来避免强制带后缀，但还是按照标准来吧。

### 新项目的统一设置

新创建的项目必须遵守一些共识：

- 清除打包产物的 scripts 必须命名为 `clean`
- 启动开发模式的 scripts 必须命名为 `dev`
- 打包代码时的 scripts 必须命名为 `build`
- 在本地运行测试的 scripts 必须命名为 `test`
- 在 CI 里运行测试的 scripts 必须命名为 `test:ci`。注意：如果你不想让某个项目在 CI 里运行测试，则不要提供 `test:ci` 的 scripts。

这是因为我在 nx.json 里做了一些配置，确保在开发 / 打包代码时，依赖的 packages 总是会生成最新的代码。

相关文档：[Task Pipeline Configuration | Nx](https://nx.dev/concepts/task-pipeline-configuration)

## 踩的一些坑

### 关于 tsconfig.base.json：所有跟路径有关的配置都应该写在 packages/\*/tsconfig.json 里，不能写在 tsconfig.base.json 里

根目录下有一个 tsconfig.base.json，其它项目会 extends 这个 base 配置，但在实际使用中发现了坑，即 typescript 解析路径是根据这个路径所在的 config 文件来的。

举个例子，一开始我在 /tsconfig.base.json 里定义了 `"declarationDir": "./dist"`，按照我的预期，我是希望 ts 能把文件输出到 packages/\*/dist 里，但实际运行后，发现项目的声明文件全被输出到了 /dist，也就是 tsconfig.base.json 所在的目录。

`include` 也是。我一开始把 include 也写在 tsconfig.base.json 里，结果就会报找不到文件的错误，写进 packages/\*/tsconfig.json 里就没事了。

### 不要用 ts-jest

会导致测试严重变慢，cpu 占满且全程温度 100 度左右

## 为什么改为 monorepos？

因为我在开发[划词翻译桌面客户端](https://github.com/hcfyapp/hcfy-pc)时，发现很多模块是可以共用的，但是扩展程序里的代码耦合太深了，不方便用在桌面客户端里。

再想到以后可能还会开发网页版的划词翻译，那时肯定也是需要共用代码的，于是就想到现在就把代码一点点拆分成小的模块，方便以后共用。

拆成小项目也能促进我从模块的角度思考该如何设计代码，这能产出更加松耦合的代码。
