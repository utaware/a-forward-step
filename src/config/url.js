export const HOST_URL = 'https://www.someacg.top'

export const API_URL = `https://www.someacg.top/api`

export const CDN_URL = `https://cdn.someacg.top/graph`

export function getDownloadImageURL(filename, isHighQuality = true) {
  const name = isHighQuality ? 'origin' : 'thumb'
  return [CDN_URL, name, filename].join('/')
}