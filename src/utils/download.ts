import { stat } from 'node:fs/promises'

import { writeFile } from 'fs-extra'
import { Impit } from 'impit'

import { delay } from './other'

let client = createClient()
const RETRYABLE_STATUS_CODES = new Set([429, 567])

export interface IDownloadOptions {
  maxRetries?: number
  retryDelaySeconds?: number
  requestIntervalSeconds?: number
  useCache?: boolean
}

function createClient() {
  return new Impit({ browser: 'chrome' })
}

function isRetryableStatus(status: number) {
  return RETRYABLE_STATUS_CODES.has(status) || status >= 500
}

function isRetryableNetworkError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return /UnexpectedEof|close_notify|ECONNRESET|ETIMEDOUT|timeout|connection reset|peer closed/i.test(message)
}

async function isValidCachedFile(filePath: string) {
  try {
    const fileStat = await stat(filePath)
    return fileStat.isFile() && fileStat.size > 0
  } catch {
    return false
  }
}

// 下载文件并保存到本地
export async function impitDownloadFile(url: string, filePath: string, options: IDownloadOptions = {}) {
  const { maxRetries = 5, retryDelaySeconds = 3, requestIntervalSeconds = 0.5, useCache = true } = options

  if (useCache && (await isValidCachedFile(filePath))) {
    return
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.fetch(url)

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        await writeFile(filePath, Buffer.from(arrayBuffer))
        await delay(requestIntervalSeconds)
        return
      }

      if (!isRetryableStatus(response.status) || attempt === maxRetries) {
        throw new Error(`Failed to download file from ${url}: HTTP ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      if (!isRetryableNetworkError(error) || attempt === maxRetries) {
        throw error
      }

      client = createClient()
    }

    const waitSeconds = retryDelaySeconds * 2 ** attempt + Math.random()
    await delay(waitSeconds)
  }
}
