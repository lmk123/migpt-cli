import { useEffect, useRef, useState } from 'react'
import { Button } from '@blueprintjs/core'

export function ImportJSON(props: { onJSON: (json: unknown) => void }) {
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>()
  const [renderInput, setRenderInput] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>()

  useEffect(() => {
    fileInputRef.current = fileInput
  }, [fileInput])

  function triggerClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      setTimeout(triggerClick)
    }
  }

  return (
    <>
      <Button
        icon={'import'}
        onClick={() => {
          setRenderInput(true)
          triggerClick()
        }}
      >
        导入
      </Button>
      {renderInput && (
        <input
          type="file"
          accept=".json"
          className={'tw-hidden'}
          ref={setFileInput}
          onChange={(event) => {
            const file = event.target.files?.[0]
            setRenderInput(false)
            setFileInput(null)
            if (file) {
              const reader = new FileReader()
              reader.onload = function (e) {
                try {
                  const json = JSON.parse(e.target?.result as string)
                  props.onJSON(json)
                } catch (error) {
                  alert('Invalid JSON file')
                }
              }
              reader.readAsText(file)
            } else {
              alert('No file selected')
            }
          }}
        />
      )}
    </>
  )
}
