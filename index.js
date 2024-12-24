const { spawn } = require('child_process')

const puppeteer = require('puppeteer')

const animeUrlPrefix = 'https://anime.girigirilove.com/'

const matchSymbol = 'playlist.m3u8'

async function getM3u8URL(code) {
  const requestUrl = animeUrlPrefix + code

  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.goto(requestUrl)

  await page.waitForSelector('#playleft')

  const targetHref = page
    .frames()
    .map(v => v.url())
    .find(v => v.includes(matchSymbol))

  const m3u8Url = new URL(targetHref).searchParams.get('url')

  await browser.close()

  return m3u8Url
}

async function main() {
  const currentAnimeCode = 'playGV6661-1-1'

  const url = await getM3u8URL(currentAnimeCode)

  const child = spawn('ffmpeg', ['-i', url, `${currentAnimeCode}.mp4`], { stdio: 'inherit' })

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
