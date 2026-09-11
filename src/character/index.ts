import { getRoleVoiceData } from './data'

async function main() {
  const roleData = await getRoleVoiceData('帕露南')
  console.log(roleData.length)
}

main()
