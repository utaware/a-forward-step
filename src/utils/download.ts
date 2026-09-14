import { writeFile } from 'fs-extra'
import { Impit } from 'impit'

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
export async function impitDownloadFile(url: string, filePath: string) {
  const response = await client.fetch(url)

  if (response.ok) {
    const arrayBuffer = await response.arrayBuffer()
    await writeFile(filePath, Buffer.from(arrayBuffer))
    return
  }
  throw new Error(`Failed to download file from ${url}: HTTP ${response.status} ${response.statusText}`)
}
