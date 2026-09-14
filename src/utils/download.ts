import { writeFile } from 'fs-extra'
import { Impit } from 'impit'

import { delay } from './other'

const client = new Impit({ browser: 'chrome' })
const RETRYABLE_STATUS_CODES = new Set([429, 567])

export interface IDownloadOptions {
  maxRetries?: number
  retryDelaySeconds?: number
  requestIntervalSeconds?: number
}

function isRetryableStatus(status: number) {
  return RETRYABLE_STATUS_CODES.has(status) || status >= 500
}

// 下载文件并保存到本地
export async function impitDownloadFile(url: string, filePath: string, options: IDownloadOptions = {}) {
  const { maxRetries = 5, retryDelaySeconds = 3, requestIntervalSeconds = 0.5 } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await client.fetch(url)

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      await writeFile(filePath, Buffer.from(arrayBuffer))
      await delay(requestIntervalSeconds)
      return
    }

    if (!isRetryableStatus(response.status) || attempt === maxRetries) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    const jitterSeconds = Math.random()
    const waitSeconds = retryDelaySeconds * 2 ** attempt + jitterSeconds
    await delay(waitSeconds)
  }
}
