import { getRoleData } from '../role/data'

import { downloadRoleGalleryData } from './gallery/download'
import { downloadRoleVoiceData } from './voice/download'

import { print } from '#utils'

async function main() {
  const roleData = await getRoleData()
  await Promise.all(
    roleData.map(async role => {
      const { name } = role
      await downloadRoleVoiceData(name)
      await downloadRoleGalleryData(name)
    })
  )
  print('All role data downloaded successfully.', 'success')
}

main()
