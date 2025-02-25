export function info(...messages: any[]) {
  console.log('[INFO]', ...messages)
}

export function warn(...messages: any[]) {
  console.log('[WARN]', ...messages)
}

export function error(...messages: any[]) {
  console.log('[ERROR]', ...messages)
}
