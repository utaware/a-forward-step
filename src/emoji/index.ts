import { getEmojiData } from './html'

async function main() {
  const emojiData = await getEmojiData()
  console.log('emojiData:', emojiData.length)
}

main()
