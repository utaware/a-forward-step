import { print } from '#utils'

import { getRoleHtml } from './html'
import { parseRoleHtml } from './data'

async function main() {
  const roleHtml = await getRoleHtml()
  const parsedRole = parseRoleHtml(roleHtml)
  print(parsedRole)
}

main()
