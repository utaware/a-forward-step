import { getAnimeInformationSet } from './girigiri/index.js'

const pv = 'GV26241'

async function main() {
  const infos = await getAnimeInformationSet(pv)

  console.log(infos)
}

main()
