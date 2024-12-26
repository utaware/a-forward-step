// const { spawn } = require('child_process')
// const puppeteer = require('puppeteer')

async function main() {
  const currentAnimeCode = 'playGV6661-1-1'

  const url = await getM3u8URL(currentAnimeCode)

  const child = spawn('ffmpeg', ['-i', url, `${currentAnimeCode}.mp4`], {
    stdio: 'inherit',
  })

  // child.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // })

  // child.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  // })

  child.on('close', code => {
    console.log(`currentAnimeCode download success`)
  })
}

main()
