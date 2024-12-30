import { exec } from 'node:child_process'
import path from 'node:path'
import ora from 'ora'
import fs from 'fs-extra'

export function generatorFfmpegInputTxt (tsFilesOption) {
  return tsFilesOption
    .map(v => {
      const { realuri } = v
      return `file ${realuri}`
    })
    .join('\n')
}

export async function execFfmpegCommand(input, output) {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -f concat -i ${input} -c copy ${output}`, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export async function clearCacheDir(dirname) {
  return new Promise((resolve, reject) => {
    exec(`rmdir /s /q ${dirname}`, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export async function transformAndClearMedia(tsFiles, cacheDir, text) {
  const inputFileName = path.resolve(cacheDir, 'input.txt')
  const outputFileName = path.resolve(cacheDir, `../${text}.mp4`)
  const ffmpegInputContent = generatorFfmpegInputTxt(tsFiles)

  const spinner = ora()

  spinner.start('生成ffmpeg输入文件清单...')
  await fs.writeFile(inputFileName, ffmpegInputContent)
  spinner.text = '即将执行ffmpeg文件格式转换...'
  await execFfmpegCommand(inputFileName, outputFileName)
  spinner.text = '完成转换输...清理多余ts文件'
  await clearCacheDir(cacheDir)
  spinner.succeed('清理完毕')

  return outputFileName
}
