function timestamp(): string {
  return new Date().toISOString()
}

export function info(message: string): void {
  console.log(`[${timestamp()}] ${message}`)
}

export function error(message: string, error?: any)  {
  console.error(`[${timestamp()}] ${message}`)
  error && console.error(error)
}
