import { Options, defaults } from '@mgc/options'
import { Alignment, Button, FocusStyleManager, Navbar } from '@blueprintjs/core'
import { useState } from 'react'

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
          {/*<div className={'tw-space-x-2'}>*/}
          {/*  <Button*/}
          {/*    icon={'play'}*/}
          {/*    onClick={() => {*/}
          {/*      if (!formEle) return*/}

          {/*      formEle.requestSubmit()*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    启动*/}
          {/*  </Button>*/}
          {/*  <Button icon={'stop'}>停止</Button>*/}
          {/*  <Button icon={'import'}>导入</Button>*/}
          {/*  <Button icon={'export'}>导出</Button>*/}
          {/*</div>*/}
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
