import { useEffect, useState } from 'react'
import {
  Options,
  exportFile,
  defaults,
  type WholeConfig,
  strip,
} from '@migptgui/options'
import { Tabs, Tab, Button, TextArea } from '@blueprintjs/core'

function toWholeConfig(config: WholeConfig) {
  return JSON.stringify(config, null, 2)
}

function envToTxt(config: WholeConfig) {
  return Object.entries(
    Object.assign(
      {
        OPENAI_API_KEY: '',
        OPENAI_MODEL: '',
        OPENAI_BASE_URL: '',
      },
      config.env,
    ),
  )
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

function jsonTojs(config: WholeConfig) {
  return `export default ${JSON.stringify(config.config, null, 2)}`
}

export function OptionsWithPreview() {
  const [config, setConfig] = useState(defaults)
  const [tabId, setTabId] = useState('whole')
  const [fileName, setFileName] = useState('migptgui.json')
  const [textAreaValue, setTextareaValue] = useState('')

  useEffect(() => {
    if (tabId === 'whole') {
      setFileName('migptgui.json')
      setTextareaValue(toWholeConfig(strip(config)))
    } else if (tabId == 'config') {
      setFileName('.migpt.js')
      setTextareaValue(jsonTojs(strip(config)))
    } else {
      setFileName('.env')
      setTextareaValue(envToTxt(strip(config)))
    }
  }, [tabId, config])

  const [formEle, setFormEle] = useState<HTMLFormElement | null>()

  return (
    <div className={'gui-web-main'}>
      <form
        className={'gui-web-form'}
        ref={setFormEle}
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Options
          config={config}
          onChange={(newConfig) => setConfig(newConfig)}
        />
      </form>
      <div className={'gui-web-preview'}>
        <div className={'gui-web-preview-head'}>
          <Tabs
            large
            id="gui-web-pre-tabs"
            selectedTabId={tabId}
            onChange={(newTabId) => setTabId(newTabId as string)}
          >
            <Tab id="whole" title="migptgui.json" />
            <Tab id="config" title=".migpt.js" />
            <Tab id="env" title=".env" />
          </Tabs>
          <div>
            <Button
              onClick={() => {
                if (formEle?.checkValidity()) {
                  alert('已填写完整。')
                } else {
                  formEle?.reportValidity()
                }
              }}
            >
              检验
            </Button>
            <Button
              intent={'primary'}
              onClick={() => {
                exportFile([textAreaValue], {
                  name: fileName,
                  type:
                    tabId === 'whole'
                      ? 'application/json'
                      : tabId === 'config'
                        ? 'text/javascript'
                        : 'text/plain',
                })
              }}
            >
              导出 {fileName}
            </Button>
          </div>
        </div>

        <TextArea fill readOnly value={textAreaValue} />
      </div>
    </div>
  )
}
