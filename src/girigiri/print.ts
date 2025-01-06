import * as picocolors from 'picocolors'

import type { IAnimePageInfos } from '@/types/index.ts'

export function printCurrentAnimeInfos(content: IAnimePageInfos) {
  const { title, remarks, introduce, tags, versions } = content

  const printLogs = [
    { desc: '动漫名称', content: title },
    { desc: '备注', content: remarks },
    { desc: '简介', content: introduce },
    { desc: '标签', content: tags },
    { desc: '剧集', content: versions },
  ]

  printLogs.forEach(({ desc, content }) => {
    const item = picocolors.green(`${desc}: ${content}`)
    console.log(item)
  })
}
