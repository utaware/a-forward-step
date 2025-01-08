import path from 'path'
import ora from 'ora'
import picocolors from 'picocolors'
import fs from 'fs-extra'
import axios from 'axios'

function calcDownloadProgress(current: number, total: number) {
  return Math.round(current / total * 100) + '%'
}

export async function downloadTsFiles(tsFiles: ITSFile[], cacheDir: string) {
  await fs.ensureDir(cacheDir)
  await fs.emptyDir(cacheDir)

  const totalDownloadCount = tsFiles.length
  let currentDownloadCount = 0

  const spinner = ora()

  spinner.start('开始下载ts文件...')

  const downloadPromiseQueue = tsFiles.map(v => {
    const { tsFileUrl, tsFileName } = v
    const tsCachePath = path.resolve(cacheDir, tsFileName)
    return new Promise((resolve, reject) => {
      axios({ method: 'get', url: tsFileUrl, responseType: 'stream' }).then(
        response => {
          const inputStream = response.data
          const outputStream = fs.createWriteStream(tsCachePath)
          inputStream.pipe(outputStream)
          inputStream.on('end', () => {
            currentDownloadCount++
            const progress = calcDownloadProgress(currentDownloadCount, totalDownloadCount)
            spinner.text = `当前下载进度: ${picocolors.green(progress)}`
            resolve(tsFileUrl)
          })
          inputStream.on('error', () => {
            reject(tsFileUrl)
          })
        }
      ).catch(() => {
        console.log(`${tsFileUrl}下载出错`)
      })
    })
  })

  await Promise.all(downloadPromiseQueue)

  spinner.succeed('ts文件下载完毕')
}
