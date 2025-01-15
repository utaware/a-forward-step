import fs from 'fs-extra'
import axios from 'axios'
import download from 'download'
import ora from 'ora'

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

  async init() {
    this.spinner = ora()
    await fs.ensureDir(DOWNLOAD_DIR)
    await fs.ensureDir(LOCAL_CACHE_DIR)
    await this.ensureCache()
    await this.run()
  }

  async ensureCache() {
    const isExist = await fs.ensureFile(LOCAL_CACHE_PATH)
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
    this.spinner.start('...开始下载...')

    const total = images.length
    let current = 0

    for await (const item of images) {
      const { file_name } = item
      const isExist = Reflect.get(this.localCache, file_name)
      if (isExist) {
        continue
      } else {
        const downloadURL = getDownloadImageURL(file_name)
        await download(downloadURL, DOWNLOAD_DIR)
        current++
        Reflect.set(this.localCache, file_name, item)
        this.spinner.text = `...当前下载: ${current}/${total}...`
      }
    }
    this.spinner.succeed('...下载完成...')
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
    // await this.checkContinueRun(images.length)

  }

  async checkContinueRun(count) {
    const isNotAll = pageSize === count
    if (isNotAll) {
      this.page++
      await this.run()
    }
  }

}

const s = new SomeACG()

s.init()