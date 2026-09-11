import { resolve } from 'node:path'

// path
export const rootPath = resolve(__dirname, '../../')

export const htmlDirPath = resolve(rootPath, 'html')
export const htmlRolePath = resolve(htmlDirPath, 'role.html')

export const dataDirPath = resolve(rootPath, 'data')
export const dataRolePath = resolve(dataDirPath, 'role.json')
export const dataEmojiPath = resolve(dataDirPath, 'emoji.json')

export const assetsDirPath = resolve(rootPath, 'assets')
export const assetsRolePath = resolve(assetsDirPath, 'role')
export const assetsEmojiPath = resolve(assetsDirPath, 'emoji')

// url
export const wikiBaseUrl = 'https://wiki.biligame.com/starengine'
// 角色页面 URL
export const wikiRoleUrl = `${wikiBaseUrl}/%E6%98%9F%E8%B6%B4%E8%A7%92%E8%89%B2%E5%9B%BE%E9%89%B4`
