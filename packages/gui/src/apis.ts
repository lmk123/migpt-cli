export async function getStatus() {
  const response = await fetch('/api/status')
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to get status：HTTP ' + response.statusText)
}

export async function run(config: unknown) {
  const response = await fetch('/api/start', {
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
  const response = await fetch('/api/stop', {
    method: 'POST',
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error('Failed to stop：HTTP ' + response.statusText)
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
