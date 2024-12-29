import path from 'node:path'
import ora from 'ora'

import fs from 'fs-extra'
import axios from 'axios'

export async function downloadTsFiles(tsFiles, cacheDir) {
  await fs.ensureDir(cacheDir)
  await fs.emptyDir(cacheDir)

  const totalFiles = tsFiles.length
  let currentCount = 0

  const spinner = ora()

  spinner.start()

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
            currentCount++
            const progress = Math.round(currentCount / totalFiles * 100) + '%'
            spinner.text = `当前下载进度${progress}`
            resolve(tsUrl)
          })
          inputStream.on('error', () => {
            reject(tsUrl)
          })
        }
      )
    })
  })

  spinner.stop()

  await Promise.all(downloadPromiseQueue)
}
