import { load } from 'cheerio'

import { type IRoleDataItem, roleDataOptionsMap } from '#options'

const paramAttributePattern = /^data-param(?<value>\d*)$/

export function getRoleDataParamType(key: string) {
  const match = key.match(paramAttributePattern)
  if (match && match.groups) {
    return match.groups.value
  }
  return ''
}

export function getRoleData(data: Record<string, string>): IRoleDataItem {
  return Object.entries(data).reduce<IRoleDataItem>((total, [param, value]) => {
    const type = getRoleDataParamType(param)
    const hasKey = Reflect.has(roleDataOptionsMap, type)
    if (hasKey) {
      const { key } = Reflect.get(roleDataOptionsMap, type)
      total[key] = value
    }
    return total
  }, {} as IRoleDataItem)
}

export function parseRoleHtml(html: string) {
  const $ = load(html)
  const roleList = $('#CardSelectTr .divsort')

  return roleList.toArray().map(element => {
    return getRoleData(element.attribs)
  })
}
