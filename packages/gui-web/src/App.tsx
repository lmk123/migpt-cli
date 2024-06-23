import { Options, defaults } from '@mgc/options'
import { Alignment, Button, FocusStyleManager, Navbar } from '@blueprintjs/core'
import { useState } from 'react'
import { ImportJSON } from './ImportJSON'

FocusStyleManager.onlyShowFocusOnTabs()

export function App() {
  const [config, setConfig] = useState(defaults)

  const [formEle, setFormEle] = useState<HTMLFormElement | null>()

  return (
    <>
      <Navbar fixedToTop>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>MiGPT 控制面板</Navbar.Heading>
          <Navbar.Divider />
          <div className={'tw-space-x-2'}>
            <Button
              icon={'play'}
              onClick={() => {
                if (!formEle) return
                formEle.requestSubmit()
              }}
            >
              启动
            </Button>
            <Button icon={'stop'}>停止</Button>
            <ImportJSON
              onJSON={(json) => {
                setConfig(json as any)
              }}
            />
            <Button
              icon={'export'}
              onClick={() => {
                // 将 JSON 数据转换为字符串
                const jsonString = JSON.stringify(config, null, 2)
                // 创建一个 Blob 对象
                const blob = new Blob([jsonString], {
                  type: 'application/json',
                })
                // 创建一个链接元素
                const link = document.createElement('a')
                // 创建一个对象 URL
                const url = URL.createObjectURL(blob)
                // 设置链接的 href 属性
                link.href = url
                // 设置下载文件的名称
                link.download = 'migpt.json'
                // 将链接元素添加到文档中
                document.body.appendChild(link)
                // 触发点击事件下载文件
                link.click()
                // 从文档中移除链接元素
                document.body.removeChild(link)
                // 释放对象 URL
                URL.revokeObjectURL(url)
              }}
            >
              导出
            </Button>
          </div>
        </Navbar.Group>
      </Navbar>
      <div className={'tw-flex'}>
        <div className={'tw-flex-initial'}>
          {/*todo: 未来开发多机器人功能时作为机器人列表*/}
        </div>
        <main className={'tw-flex-1 tw-p-4'}>
          <form
            ref={setFormEle}
            onSubmit={(event) => {
              event.preventDefault()
              console.log('提交了表单')
              console.log(config)
            }}
          >
            <Options
              config={config}
              onChange={(config) => {
                setConfig(config)
              }}
            />
          </form>
        </main>
      </div>
    </>
  )
}
