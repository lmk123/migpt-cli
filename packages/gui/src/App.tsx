import {
  Options,
  defaults,
  exportJSON,
  importJSON,
  strip,
  normalize,
  type GuiConfig,
} from '@migptgui/options'
import {
  Alignment,
  AnchorButton,
  Button,
  ButtonGroup,
  FocusStyleManager,
  Navbar,
} from '@blueprintjs/core'
import { useEffect, useState } from 'react'
import * as apis from './apis.ts'
import _debounce from 'lodash/debounce.js'

const saveConfigDebounced = _debounce(apis.saveConfig, 1000)

FocusStyleManager.onlyShowFocusOnTabs()

export function App() {
  const [config, setConfig] = useState(defaults)

  const [formEle, setFormEle] = useState<HTMLFormElement | null>()

  // 读取配置
  useEffect(() => {
    apis.getConfig().then((config) => {
      if (config) {
        setConfig(config)
      }
    })
  }, [])

  // 保存配置
  useEffect(() => {
    if (config !== defaults) {
      saveConfigDebounced(config)
    }
  }, [config])

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
                    setConfig(normalize(json as GuiConfig))
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
              apis.run(config).then(
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
              onPublicURLTest={(url) => {
                apis.testPublicURL(url).then(
                  (res) => {
                    if (res.success) {
                      alert('测试成功。')
                    } else {
                      alert('测试失败。')
                    }
                  },
                  (err) => {
                    alert('测试失败。' + err)
                  },
                )
              }}
            />
          </form>
        </main>
      </div>
    </>
  )
}
