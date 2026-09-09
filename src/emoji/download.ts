import download from 'download'

import { getEmojiData } from './html'
import { getRoleData } from '../role/data'

import { print } from '#utils'
import { assetsEmojiPath } from '#config'
import { type IRoleDataItem } from '#options'

export function parseEmojiRole(imgAlt: string) {
  const emojiRegExp = /UT Item Emoji\s(?<id>\d+)\s(?<filename>.*)$/
  const match = imgAlt.match(emojiRegExp)
  if (match && match.groups) {
    const { id, filename } = match.groups
    return { id, filename }
  } else {
    return { id: '', filename: '' }
  }
}

export function getEmojiRoleName(id: string, roleData: IRoleDataItem[]) {
  const item = roleData.find(role => role.id === id)
  return item ? item.name : '未知名称'
}

export async function downloadAllEmojiData() {
  const roleData = await getRoleData()
  print(`Downloading roleData: ${roleData.length}`, 'success')
  const emojiData = await getEmojiData()
  print(`Downloading emojiData: ${emojiData.length}`, 'success')
  await Promise.all(
    emojiData.map(async ({ imgSrc, imgAlt }) => {
      const { id, filename } = parseEmojiRole(imgAlt)
      if (id && filename) {
        const roleName = getEmojiRoleName(id, roleData)
        const rolePath = `${assetsEmojiPath}/${roleName}`
        await download(imgSrc, rolePath, { filename: filename })
      }
    })
  )
  print('All emoji data downloaded successfully!', 'success')
}
