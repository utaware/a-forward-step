import inquirer from 'inquirer'

import { getNovelTextContent } from './html'

async function main() {
  const { chapter } = await inquirer.prompt<{ chapter: number }>({
    type: 'number',
    name: 'chapter',
    message: '请输入小说章节号：',
  })
  const textContent = await getNovelTextContent(chapter)
  const clipboardy = await import('clipboardy')
  await clipboardy.default.write(textContent)
  console.log('已将小说内容复制到剪贴板')
}

main()
