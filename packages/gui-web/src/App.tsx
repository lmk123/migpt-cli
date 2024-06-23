import { Options } from '@mgc/options'
import { FocusStyleManager } from '@blueprintjs/core'

FocusStyleManager.onlyShowFocusOnTabs()

export function App() {
  return (
    <div className={'tw-flex'}>
      <div className={'tw-flex-initial'}>
        {/*todo: 未来开发多机器人功能时作为机器人列表*/}
      </div>
      <main className={'tw-flex-1 tw-p-4'}>
        <Options
          onChange={(config) => {
            console.log(config)
          }}
        />
      </main>
    </div>
  )
}
