import fs from 'fs-extra'
import Store from 'configstore'
import path from 'path'

import { cacheDir } from '#utils'

export const m3u8CacheFilePath = path.resolve(cacheDir, './cache/m3u8.json')

export async function getM3u8URLCacheContent() {
  const isExist = await fs.exists(m3u8CacheFilePath)

  const result = isExist ? await fs.readJSON(m3u8CacheFilePath) : {}

  if (!isExist) {
    await fs.ensureFile(m3u8CacheFilePath)
    await fs.writeJSON(m3u8CacheFilePath, {})
  }

  return result
}

export async function getM3u8URLCacheStore() {
  const m3u8CacheContent = await getM3u8URLCacheContent()
  return new Store('m3u8', m3u8CacheContent, { configPath: m3u8CacheFilePath })
}

export async function writeM3u8URLCacheStore(store: Store) {
  return await fs.writeJSON(m3u8CacheFilePath, store.all, {
    spaces: 2
  })
}
