import { FormGroup, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'

interface TTSVolcanoParams {
  defaultSpeaker?: string
  volcano?: {
    appId?: string
    accessToken?: string
  }
}

interface TTSDouBaoProps {
  value?: TTSVolcanoParams
  onChange: (value: TTSVolcanoParams) => void
}

export function TTSVolcano(props: TTSDouBaoProps) {
  const { value, onChange } = props
  return (
    <div>
      <FormGroup label={'APP ID'} inline>
        <InputGroup
          required
          value={value?.volcano?.appId || ''}
          onValueChange={(val) => {
            onChange(
              produce(value || {}, (draft) => {
                if (!draft.volcano) {
                  draft.volcano = {}
                }
                draft.volcano.appId = val === '' ? undefined : val
              }),
            )
          }}
        />
      </FormGroup>
      <FormGroup label={'Access Token'} inline>
        <InputGroup
          required
          value={value?.volcano?.accessToken || ''}
          onValueChange={(val) => {
            onChange(
              produce(value || {}, (draft) => {
                if (!draft.volcano) {
                  draft.volcano = {}
                }
                draft.volcano.accessToken = val === '' ? undefined : val
              }),
            )
          }}
        />
      </FormGroup>
      <FormGroup label={'音色'} inline>
        <InputGroup
          value={value?.defaultSpeaker || ''}
          onValueChange={(val) => {
            onChange(
              produce(value || {}, (draft) => {
                draft.defaultSpeaker = val === '' ? undefined : val
              }),
            )
          }}
        />
      </FormGroup>
    </div>
  )
}