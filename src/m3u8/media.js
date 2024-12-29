import { exec } from 'node:child_process'
import path from 'node:path'

import fs from 'fs-extra'

export async function useFffmpegTransform(tsFiles, cacheDir, text) {
  const input = path.resolve(cacheDir, 'input.txt')
  const output = path.resolve(cacheDir, 'output.mp4')

  const inputFileContent = tsFiles
    .map(v => {
      const { realuri } = v
      return `file ${realuri}`
    })
    .join('\n')

  await fs.writeFile(input, inputFileContent)

  exec(`ffmpeg -f concat -i ${input} -c copy ${output}`, async () => {
    console.log('转换完成')
    const copyPath = path.resolve(cacheDir, `../${text}.mp4`)
    console.log('移动最终下载文件中...')
    await fs.copyFile(output, copyPath)
    console.log('清理缓存文件夹')
    await fs.emptyDir(cacheDir)
    await fs.remove(cacheDir)
    console.log('清理完毕')
  })

  return output
}
