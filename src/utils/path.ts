import path from 'path'
import url from 'url'

const currentFileUrl = url.fileURLToPath(import.meta.url)

export const rootDir = path.resolve(currentFileUrl, '../../../')
