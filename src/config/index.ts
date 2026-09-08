import { resolve } from 'node:path'

export const rootPath = resolve(__dirname, '../../')

export const htmlDirPath = resolve(rootPath, 'html')
export const htmlRolePath = resolve(htmlDirPath, 'role.html')
