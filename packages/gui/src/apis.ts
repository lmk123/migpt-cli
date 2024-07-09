import { GuiConfig } from '@migptgui/options'

export async function getStatus() {
  const response = await fetch('/api/status')
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to get status：HTTP ' + response.statusText)
}

export async function run(config: unknown) {
  const response = await fetch('/api/default/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to start：HTTP ' + response.statusText)
}

export async function stop() {
  const response = await fetch('/api/default/stop', {
    method: 'POST',
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to stop：HTTP ' + response.statusText)
}

export async function getConfig() {
  const response = await fetch('/api/default')
  if (response.ok) {
    const res = await response.json()
    return res.config as GuiConfig | undefined
  }
  throw new Error('Failed to get config：HTTP ' + response.statusText)
}

export async function saveConfig(config: GuiConfig) {
  const response = await fetch('/api/default', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to save config：HTTP ' + response.statusText)
}

export async function reset() {
  const response = await fetch('/api/default', {
    method: 'DELETE',
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to stop：HTTP ' + response.statusText)
}
