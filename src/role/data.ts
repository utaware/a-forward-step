import { load } from 'cheerio'
import fs from 'fs-extra'

import { dataDirPath, dataRolePath } from '#config'
import { jsonStringifyFormat } from '#utils'

import { getRoleHtml } from './html'

import { type IRoleDataItem, roleDataOptionsMap } from '#options'

const paramAttributePattern = /^data-param(?<value>\d*)$/

export function getRoleDataParamType(key: string) {
  const match = key.match(paramAttributePattern)
  if (match && match.groups) {
    return match.groups.value
  }
  return ''
}

export function parseRoleData(data: Record<string, string>, roleImgSrc: string): IRoleDataItem {
  const item = Object.entries(data).reduce<IRoleDataItem>((total, [param, value]) => {
    const type = getRoleDataParamType(param)
    const hasKey = Reflect.has(roleDataOptionsMap, type)
    if (hasKey) {
      const { key } = Reflect.get(roleDataOptionsMap, type)
      total[key] = value
    }
    return total
  }, {} as IRoleDataItem)
  return { ...item, roleImgSrc }
}

export function parseRoleHtml(html: string) {
  const $ = load(html)
  const roleList = $('#CardSelectTr .divsort')

  return roleList.toArray().map(element => {
    const roleImgEl = $(element).find('img')
    const roleImgSrc = roleImgEl.attr('src') || ''
    return parseRoleData(element.attribs, roleImgSrc)
  })
}

export async function saveRoleDataToJsonFile(roleData: IRoleDataItem[]) {
  await fs.ensureDir(dataDirPath)
  const jsonData = jsonStringifyFormat(roleData)
  await fs.writeFile(dataRolePath, jsonData, 'utf-8')
}

export async function getRoleData() {
  const hasCache = await fs.pathExists(dataRolePath)
  if (hasCache) {
    const jsonData = await fs.readFile(dataRolePath, 'utf-8')
    return JSON.parse(jsonData) as IRoleDataItem[]
  } else {
    const roleHtml = await getRoleHtml()
    const parsedRoleData = parseRoleHtml(roleHtml)
    await saveRoleDataToJsonFile(parsedRoleData)
    return parsedRoleData
  }
}
