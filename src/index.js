import { getM3u8URL } from '#src/girigiri/index.js'
import { parseM3u8URLFiles, downloadTSFiles } from '#src/m3u8/index.js'

async function main() {
  const currentAnimeCode = '/playGV6661-1-1/'

  // const url = await getM3u8URL(currentAnimeCode)
  const url =
    'https://love.girigirilove.com/zijian/anime/2024/10/1030/GetsuyoubinoTawawaS2/01/playlist.m3u8'

  const content = await parseM3u8URLFiles(url)

  await downloadTSFiles(content)
}

main()
