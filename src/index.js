import { spawn } from 'child_process'

import { getM3u8URL } from './girigiri/index.js'
import { parseM3u8URLFiles, downloadTSFiles } from './m3u8/index.js'

async function main() {
  const currentAnimeCode = '/playGV6661-1-1/'

  // const url = await getM3u8URL(currentAnimeCode)
  const url =
    'https://love.girigirilove.com/zijian/anime/2024/10/1030/GetsuyoubinoTawawaS2/01/playlist.m3u8'

  const content = await parseM3u8URLFiles(url)

  await downloadTSFiles(content)

  // const child = spawn('ffmpeg', ['-i', url, `${currentAnimeCode}.mp4`], {
  //   stdio: 'inherit',
  // })

  // child.stdout.on('data', data => {
  //   console.log(`stdout: ${data}`)
  // })

  // child.stderr.on('data', data => {
  //   console.error(`stderr: ${data}`)
  // })

  // child.on('close', code => {
  //   console.log(`currentAnimeCode download success`)
  // })
}

main()
