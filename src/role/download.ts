import download from 'download'
import fs from 'fs-extra'

import { getRoleData } from './data'

import { assetsRolePath } from '#config'
import { print } from '#utils'

export async function downloadRoleData() {
  const roleData = await getRoleData()
  await fs.ensureDir(assetsRolePath)

  for await (const item of roleData) {
    const { roleImgSrc, name } = item
    const fileName = `${name}.png`
    await download(roleImgSrc, assetsRolePath, { filename: fileName })
  }

  print('Role data downloaded successfully')
}
