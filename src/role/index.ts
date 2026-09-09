import { print } from '#utils'

import { getRoleData } from './data'

async function main() {
  const roleData = await getRoleData()
  print(roleData)
}

main()
