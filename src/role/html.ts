import axios from 'axios'
import fs from 'fs-extra'
import { load } from 'cheerio'

import { print } from '#utils'
import { htmlDirPath, htmlRolePath, wikiRoleUrl } from '#config'

import { type IRoleDataItem, roleDataOptionsMap } from '#options'

// 正则表达式，用于匹配角色数据的 HTML 属性，形如 data-param{n}
const paramAttributePattern = /^data-param(?<value>\d*)$/

// 获取角色数据参数类型
// data-param{n}开头的属性
export function getRoleDataParamType(key: string) {
  const match = key.match(paramAttributePattern)
  if (match && match.groups) {
    return match.groups.value
  }
  return ''
}

// 请求角色页面的 HTML 内容
export async function requestRoleHtml() {
  const { status, data } = await axios.get(wikiRoleUrl)
  console.log(status)
  const isSuccess = status === 200
  if (isSuccess) {
    print('Role response saved successfully.', 'success')
  } else {
    print('Failed to save role response.', 'error')
  }
  // console.log(data)
  return data
}

// 解析角色数据
// 将角色数据的 HTML 属性解析为 IRoleDataItem 对象
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

// 解析角色 HTML，提取角色数据列表
export function parseRoleHtml(html: string) {
  const $ = load(html)
  const roleList = $('#CardSelectTr .divsort')

  return roleList.toArray().map(element => {
    const roleImgEl = $(element).find('img')
    const roleImgSrc = roleImgEl.attr('src') || ''
    return parseRoleData(element.attribs, roleImgSrc)
  })
}

// 保存角色 HTML 到本地文件
export async function saveRoleHtml(html: string) {
  try {
    await fs.writeFile(htmlRolePath, html)
    print('Role HTML saved successfully.', 'success')
    return true
  } catch (error) {
    print('Failed to save role HTML.', 'error')
    return false
  }
}

// 获取角色页面的 HTML 内容，优先从本地文件获取，如果不存在则从服务器请求。
export async function getRoleHtml() {
  await fs.ensureDir(htmlDirPath)
  const haxExsitHtml = await fs.pathExists(htmlRolePath)
  if (haxExsitHtml) {
    const html = await fs.readFile(htmlRolePath, 'utf-8')
    return html
  } else {
    const html = await requestRoleHtml()
    await saveRoleHtml(html)
    return html
  }
}

// 使用角色 HTML，返回解析后的角色数据列表
export async function useRoleHtmlData() {
  const roleHtml = await getRoleHtml()
  const parsedRoleData = parseRoleHtml(roleHtml)
  return parsedRoleData
}
