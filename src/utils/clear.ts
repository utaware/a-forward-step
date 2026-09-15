import { rm } from 'node:fs/promises'

import { assetsDir } from '#config'

export async function clearAssetsDir() {
  await rm(assetsDir, { recursive: true, force: true })
}
