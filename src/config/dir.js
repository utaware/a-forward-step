import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

export const ROOT_DIR = resolve(__dirname, '../../')

export const IGNORE_DIR = resolve(ROOT_DIR, './someacg')

export const DOWNLOAD_DIR = resolve(IGNORE_DIR, './images')

export const LOCAL_CACHE_DIR= resolve(IGNORE_DIR, './local')

export const LOCAL_CACHE_FILE = 'cache.json'

export const LOCAL_CACHE_PATH = resolve(LOCAL_CACHE_DIR, LOCAL_CACHE_FILE)