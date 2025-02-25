function getDate() {
  return new Date().toISOString()
}

export function info(...messages: any[]) {
  console.log('[INFO]', ...messages)
}

export function warn(...messages: any[]) {
  console.log('[WARN]', ...messages)
}

export function error(...messages: any[]) {
  console.error('[ERROR]', ...messages)
}
