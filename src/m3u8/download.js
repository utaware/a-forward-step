import path from 'node:path'
import fs from 'fs-extra'
import axios from 'axios'

import { rootDir } from '../utils/index.js'

export async function downloadTSFiles(files) {
  const cacheTSDir = path.resolve(rootDir, 'ts-cache')

  await fs.ensureDir(cacheTSDir)
  await fs.emptyDir(cacheTSDir)

  const downloadPromiseQueue = files.map(v => {
    const { tsUrl, uri } = v
    const tsCachePath = path.resolve(cacheTSDir, uri)
    return axios({ method: 'get', url: tsUrl, responseType: 'stream' }).then(
      response => {
        response.data.pipe(fs.createWriteStream(tsCachePath))
      }
    )
  })

  Promise.all(downloadPromiseQueue)
    .then(() => {
      console.log('success')
    })
    .catch(() => {
      console.log('error')
    })
}
