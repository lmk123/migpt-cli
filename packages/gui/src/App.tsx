import {
  Options,
  defaults,
  exportJSON,
  importJSON,
  strip,
} from '@migptgui/options'
import {
  Alignment,
  AnchorButton,
  Button,
  ButtonGroup,
  FocusStyleManager,
  Navbar,
} from '@blueprintjs/core'
import { useState } from 'react'
import * as apis from './apis.ts'

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
            <ButtonGroup>
              <Button
                icon={'play'}
                onClick={() => {
                  if (!formEle) return
                  formEle.requestSubmit()
                }}
              >
                启动
              </Button>
              <Button
                icon={'stop'}
                onClick={() => {
                  apis.stop().then(
                    () => {
                      alert('停止成功！')
                    },
                    (err) => {
                      alert('停止失败！' + err)
                    },
                  )
                }}
              >
                停止
              </Button>
              <Button
                icon={'reset'}
                onClick={() => {
                  apis.reset().then(
                    (response) => {
                      if (response.success) {
                        alert('重置成功！')
                      } else {
                        alert(
                          '重置失败！\n' +
                            JSON.stringify(response.error, null, 2),
                        )
                      }
                    },
                    (err) => {
                      alert('重置失败！' + err)
                    },
                  )
                }}
              >
                重置
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                icon={'import'}
                onClick={() => {
                  importJSON().then((json) => {
                    setConfig(json as any)
                  })
                }}
              >
                导入
              </Button>
              <Button
                icon={'export'}
                onClick={() => {
                  exportJSON(strip(config), 'migptgui.json')
                }}
              >
                导出
              </Button>
              <AnchorButton
                icon={'document'}
                href={'https://migptgui.com/docs/options/'}
                intent={'primary'}
                target={'_blank'}
              >
                配置项详解
              </AnchorButton>
            </ButtonGroup>
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
              apis.run(strip(config)).then(
                () => {
                  alert('启动成功！你可以切换回终端内查看运行日志。')
                },
                (err) => {
                  alert('启动失败！' + err)
                },
              )
            }}
          >
            <Options
              config={config}
              onChange={(config) => {
                // console.log('config and stripped config', config, strip(config))
                setConfig(config)
              }}
            />
          </form>
        </main>
      </div>
    </>
  )
}
