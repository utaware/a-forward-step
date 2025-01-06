import * as path from 'node:path'
import url from 'node:url'

const currentFileUrl = url.fileURLToPath(import.meta.url)

export const rootDir = path.resolve(currentFileUrl, '../../../')
