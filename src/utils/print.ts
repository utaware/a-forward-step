import pc from 'picocolors'

import { jsonStringifyFormat } from './json'

export type TLogType = 'success' | 'error' | 'primary' | 'warning'

export function print(msg: any, type: TLogType = 'primary') {
  const message = typeof msg === 'string' ? msg : jsonStringifyFormat(msg)
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
