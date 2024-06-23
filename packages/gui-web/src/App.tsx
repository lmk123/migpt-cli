import { Options, defaults } from '@mgc/options'
import { FocusStyleManager } from '@blueprintjs/core'
import { useState } from 'react'

FocusStyleManager.onlyShowFocusOnTabs()

export function App() {
  const [config, setConfig] = useState(defaults)

  return (
    <div className={'tw-flex'}>
      <div className={'tw-flex-initial'}>
        {/*todo: 未来开发多机器人功能时作为机器人列表*/}
      </div>
      <main className={'tw-flex-1 tw-p-4'}>
        <Options
          config={config}
          onChange={(config) => {
            console.log(config)
            setConfig(config)
          }}
        />
      </main>
    </div>
  )
}
