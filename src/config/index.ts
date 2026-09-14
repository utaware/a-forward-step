import { resolve } from 'node:path'

// path
export const rootDir = resolve(__dirname, '../../')

export const publicDir = resolve(rootDir, 'public')
export const assetsDir = resolve(rootDir, 'assets')

export const audioDir = resolve(assetsDir, 'audio')

export const port = Number(process.env.PORT) || 3000
