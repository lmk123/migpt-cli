import { FormGroup, InputGroup } from '@blueprintjs/core'
import { produce } from 'immer'
import { type TTSConfig } from 'mi-gpt-tts'

type TTSVolcanoParams = Pick<TTSConfig, 'defaultSpeaker' | 'volcano'>

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
                  draft.volcano = {
                    appId: '',
                    accessToken: '',
                  }
                }
                draft.volcano.appId = val
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
                  draft.volcano = {
                    appId: '',
                    accessToken: '',
                  }
                }
                draft.volcano.accessToken = val
              }),
            )
          }}
        />
      </FormGroup>
      <FormGroup label={'音色'} inline>
        <InputGroup
          placeholder={'默认'}
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
