function getDate() {
  return new Date().toISOString()
}

export function info(...messages: any[]) {
  console.log(getDate(), '[INFO]', ...messages)
}

export function warn(...messages: any[]) {
  console.log(getDate(), '[WARN]', ...messages)
}

export function error(...messages: any[]) {
  console.log(getDate(), '[ERROR]', ...messages)
}
