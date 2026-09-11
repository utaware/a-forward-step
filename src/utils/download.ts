import { writeFile } from 'fs-extra'
import { Impit } from 'impit'

const client = new Impit({ browser: 'chrome' })

// 下载文件并保存到本地
export async function impitDownloadFile(url: string, filePath: string) {
  const response = await client.fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  await writeFile(filePath, Buffer.from(arrayBuffer))
}
