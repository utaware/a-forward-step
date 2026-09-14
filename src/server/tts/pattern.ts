// 正则模式，用于验证语音合成请求中的参数格式
export const percentPattern = /^(default|[+-]\d{1,3}%)$/
// 语音参数正则模式
export const voicePattern = /^[a-z]{2,3}-[A-Z]{2}-[A-Za-z0-9]+Neural$/
// 语言参数正则模式
export const languagePattern = /^[a-z]{2,3}-[A-Z]{2}$/
