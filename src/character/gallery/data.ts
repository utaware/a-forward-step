import fs from 'fs-extra'

import { jsonStringifyFormat } from '#utils'

import { useRoleGalleryData } from './html'
import { getRoleGalleryDataDir, getRoleGalleryDataPath } from './url'

import type { IRoleGalleryItem } from './html'

// 更新角色画廊数据
export async function cacheRoleGalleryData(name: string) {
  const galleryDirPath = getRoleGalleryDataDir(name)
  const galleryDataPath = getRoleGalleryDataPath(name)
  const data = await useRoleGalleryData(name)
  await fs.ensureDir(galleryDirPath)
  const cacheData = jsonStringifyFormat(data)
  await fs.outputFile(galleryDataPath, cacheData)
  return data
}

// 确保角色画廊数据已缓存
export async function hasRoleGalleryDataCache(name: string) {
  const galleryDataPath = getRoleGalleryDataPath(name)
  return await fs.pathExists(galleryDataPath)
}

// 获取角色画廊数据
export async function getRoleGalleryData(name: string): Promise<IRoleGalleryItem[]> {
  const hasCache = await hasRoleGalleryDataCache(name)
  if (hasCache) {
    const galleryDataPath = getRoleGalleryDataPath(name)
    return await fs.readJson(galleryDataPath)
  } else {
    return await cacheRoleGalleryData(name)
  }
}
