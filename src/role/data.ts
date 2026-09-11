import fs from 'fs-extra'
import inquirer from 'inquirer'

import { dataDirPath, dataRolePath } from '#config'
import { jsonStringifyFormat } from '#utils'

import { useRoleHtmlData } from './html'

import { type IRoleDataItem } from '#options'

// 将角色数据保存到 JSON 文件
export async function saveRoleDataToJsonFile(roleData: IRoleDataItem[]) {
  await fs.ensureDir(dataDirPath)
  const jsonData = jsonStringifyFormat(roleData)
  await fs.writeFile(dataRolePath, jsonData, 'utf-8')
}

// 检查是否存在角色数据缓存文件
export async function hasRoleDataCache() {
  return await fs.pathExists(dataRolePath)
}

// 确认是否使用已有的角色数据缓存
export async function ensureUseDataCache() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useCache',
      message: '是否使用缓存的角色数据？',
      default: true,
    },
  ])
  return answer.useCache
}

// 更新角色数据缓存文件
export async function updateRoleDataCache() {
  await fs.emptyDir(dataDirPath)
  const parsedRoleData = await useRoleHtmlData()
  await saveRoleDataToJsonFile(parsedRoleData)
  return parsedRoleData
}

// 获取角色数据，优先使用缓存文件，如果不存在则解析 HTML 并保存缓存
export async function getRoleData() {
  const hasCache = await hasRoleDataCache()
  if (hasCache) {
    const useCache = await ensureUseDataCache()
    if (useCache) {
      const jsonData = await fs.readFile(dataRolePath, 'utf-8')
      return JSON.parse(jsonData) as IRoleDataItem[]
    }
  }
  const updateData = await updateRoleDataCache()
  return updateData
}
