import Joi from 'joi'

import { getNovelTextContent } from '../../novel/html'

interface NovelRequest {
  chapter: number
}

const novelRequestSchema = Joi.object<NovelRequest>({
  chapter: Joi.number().integer().positive().required().messages({
    'any.required': '请输入文章章节',
    'number.base': '文章章节必须是数字',
    'number.integer': '文章章节必须是整数',
    'number.positive': '文章章节必须大于 0',
  }),
})

function parseNovelRequest(body: unknown) {
  const { error, value } = novelRequestSchema.validate(body, {
    stripUnknown: true,
  })

  if (error) {
    throw new Error(error.details.map(detail => detail.message).join('；'))
  }

  return value
}

export async function getNovelText(body: unknown) {
  const { chapter } = parseNovelRequest(body)
  const text = await getNovelTextContent(chapter)
  return { chapter, text }
}
