import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const currentFileUrl = fileURLToPath(import.meta.url)

export const rootDir = resolve(currentFileUrl, '../../../')

export const __filename = (path: string) => fileURLToPath(path)

export const __dirname = (path: string) => dirname(fileURLToPath(path))
