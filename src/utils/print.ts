import pc from 'picocolors'

export type TLogType = 'success' | 'error' | 'primary' | 'warning'

export function print(message: string, type: TLogType = 'primary') {
  switch (type) {
    case 'primary':
      console.log(pc.blue(message))
      break
    case 'warning':
      console.log(pc.yellow(message))
      break
    case 'success':
      console.log(pc.green(message))
      break
    case 'error':
      console.log(pc.red(message))
      break
    default:
      console.log(pc.gray(message))
      break
  }
}
