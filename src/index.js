import fs from 'fs-extra'
import axios from 'axios'
import download from 'download'
import pLimit from 'p-limit'
import pico from 'picocolors'

import {
  API_URL,
  DOWNLOAD_DIR,
  LOCAL_CACHE_DIR,
  LOCAL_CACHE_PATH,
  SUCCESS_CODE,
  getDownloadImageURL,
} from '#config'

class SomeACG {

  page = 1
  pageSize = 30
  isComplete = false
  localCache = {}

  get requestURL() {
    return API_URL + '/list'
  }

  isSuccess(code) {
    return code === SUCCESS_CODE
  }

  colorfull(message, type) {
    switch (type) {
      case 'primary':
        return pico.blue(message)
      case 'danger':
        return pico.red(message)
      case 'success':
        return pico.green(message)
      case 'info':
        return pico.cyan(message)
      default:
        return message
    }
  }

  async init() {
    this.limitQueue = pLimit(8)
    await fs.ensureDir(DOWNLOAD_DIR)
    await fs.ensureDir(LOCAL_CACHE_DIR)
    await this.ensureCache()
    await this.run()
  }

  async ensureCache() {
    const isExist = await fs.exists(LOCAL_CACHE_PATH)
    if (isExist) {
      const cacheContent = await fs.readJSON(LOCAL_CACHE_PATH)
      this.localCache = cacheContent
    } else {
      await fs.writeJSON(LOCAL_CACHE_PATH, {})
    }
  }

  async syncCache () {
    await fs.writeJSON(LOCAL_CACHE_PATH, this.localCache, { spaces: 2 })
  }

  async download(images) {

    const total = images.length
    let current = 0

    console.log(`当前第${this.colorfull(this.page, 'info')}次下载...`)

    const queue = images.map((item) => {
      return this.limitQueue(() => new Promise((resolve, reject) => {
        const { file_name } = item
        const isExist = Reflect.has(this.localCache, file_name)
        if (isExist) {
          resolve()
        } else {
          const downloadURL = getDownloadImageURL(file_name)
          download(downloadURL, DOWNLOAD_DIR).then(() => {
            current++
            Reflect.set(this.localCache, file_name, item)
            console.log(`下载完成:${
              this.colorfull(file_name, 'success')
            }...进度:${
              this.colorfull(`${current}/${total}`, 'primary')
            }`)
            resolve()
          }).catch((err) => {
            console.log(`下载失败:${
              this.colorfull(file_name, 'danger')
            }`)
            reject(err)
          })
        }
      }))
    })

    await Promise.allSettled(queue)

  }

  async run() {
    const { requestURL, page, isSuccess } = this
    const { status, data } = await axios.get(requestURL, { params: { page } })

    if (!isSuccess(status)) {
      return false
    }

    const { body: images, status: code } = data

    if (!isSuccess(code) || !Array.isArray(images)) {
      return false
    }

    try {
      await this.download(images)
    } catch (error) {
      console.error(error)
    } finally {
      await this.syncCache()
    }

    await this.checkContinueRun(images.length)

  }

  async checkContinueRun(count) {
    const { pageSize } = this
    const isNotAll = pageSize === count
    if (isNotAll) {
      this.page++
      await this.run()
    }
  }

}

const s = new SomeACG()

s.init()