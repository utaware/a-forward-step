export interface TTSConfig {
  text: string
  voice: string
  lang: string
  outputFormat: string
  rate: string
  pitch: string
  volume: string
  timeout: number
}

// 默认的语音合成配置选项
export const defaultTTSOptions: TTSConfig = {
  text: '未输入有效文本',
  voice: 'zh-CN-XiaoxiaoNeural',
  lang: 'zh-CN',
  outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
  rate: 'default',
  pitch: 'default',
  volume: 'default',
  timeout: 15000,
}
