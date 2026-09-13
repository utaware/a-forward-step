import { getRoleData } from '../role/data'

import { downloadRoleGalleryData } from './gallery/download'
import { downloadRoleVoiceData } from './voice/download'

import { print } from '#utils'

interface Role {
  name: string
}

async function main(): Promise<void> {
  const roleData: Role[] = await getRoleData()
  for await (const role of roleData) {
    const { name } = role
    await downloadRoleVoiceData(name)
    await downloadRoleGalleryData(name)
  }
  print('All role data downloaded successfully.', 'success')
}

main()
