function timestamp(): string {
  return new Date().toISOString()
}

export function info(message: string): void {
  console.log(`[${timestamp()}] ${message}`)
}

export function error(message: string, error?: Error): void {
  console.error(`[${timestamp()}] ${message}`)
  if (error)  { console.error(error) }
}
