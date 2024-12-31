import path from 'node:path'
import ora from 'ora'
import picocolors from 'picocolors'
import fs from 'fs-extra'
import axios from 'axios'

function calcDownloadProgress(current, total) {
  return Math.round(current / total * 100) + '%'
}

export async function downloadTsFiles(tsFiles, cacheDir) {
  await fs.ensureDir(cacheDir)
  await fs.emptyDir(cacheDir)

  const totalDownloadCount = tsFiles.length
  let currentDownloadCount = 0

  const spinner = ora()

  spinner.start('开始下载ts文件...')

  const downloadPromiseQueue = tsFiles.map(v => {
    const { tsUrl, realuri } = v
    const tsCachePath = path.resolve(cacheDir, realuri)
    return new Promise((resolve, reject) => {
      axios({ method: 'get', url: tsUrl, responseType: 'stream' }).then(
        response => {
          const inputStream = response.data
          const outputStream = fs.createWriteStream(tsCachePath)
          inputStream.pipe(outputStream)
          inputStream.on('end', () => {
            currentDownloadCount++
            const progress = calcDownloadProgress(currentDownloadCount, totalDownloadCount)
            spinner.text = `当前下载进度: ${picocolors.green(progress)}`
            resolve(tsUrl)
          })
          inputStream.on('error', () => {
            reject(tsUrl)
          })
        }
      ).catch(() => {
        console.log(`${tsUrl}下载出错`)
      })
    })
  })

  await Promise.all(downloadPromiseQueue)

  spinner.succeed('ts文件下载完毕')
}
