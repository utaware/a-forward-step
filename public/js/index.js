const form = document.querySelector('#tts-form')
const text = document.querySelector('#text')
const count = document.querySelector('#count')
const chapter = document.querySelector('#chapter')
const preChapter = document.querySelector('#pre-chapter')
const nextChapter = document.querySelector('#next-chapter')
const submit = document.querySelector('#submit')
const statusEl = document.querySelector('#status')
const player = document.querySelector('#player')
const audio = document.querySelector('#audio')
const download = document.querySelector('#download')
const chapterStorageKey = 'tts:novel:chapter'

function updateCount() {
  count.textContent = `${text.value.length} / 30000`
}

function formatPercent(value) {
  const number = Number(value)
  return `${number >= 0 ? '+' : ''}${number}%`
}

text.addEventListener('input', updateCount)
updateCount()

function getCurrentChapter() {
  return Math.max(1, Number(chapter.value) || Number(localStorage.getItem(chapterStorageKey)) || 1)
}

function setChapter(value) {
  chapter.value = String(value)
  localStorage.setItem(chapterStorageKey, String(value))
}

function setChapterLoading(isLoading) {
  preChapter.disabled = isLoading
  nextChapter.disabled = isLoading
}

async function loadChapter(targetChapter) {
  setChapterLoading(true)
  statusEl.textContent = '正在加载章节文本…'

  try {
    const response = await fetch('/api/novel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter: targetChapter }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '章节文本加载失败')

    setChapter(result.chapter)
    text.value = result.text
    updateCount()
    statusEl.textContent = `已加载第 ${result.chapter} 章`
  } catch (error) {
    statusEl.textContent = error.message || '章节文本加载失败'
  } finally {
    setChapterLoading(false)
  }
}

setChapter(Number(localStorage.getItem(chapterStorageKey)) || getCurrentChapter())

preChapter.addEventListener('click', () => {
  loadChapter(Math.max(1, getCurrentChapter() - 1))
})

nextChapter.addEventListener('click', () => {
  loadChapter(getCurrentChapter() + 1)
})

chapter.addEventListener('change', () => {
  setChapter(getCurrentChapter())
})

chapter.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault()
    loadChapter(getCurrentChapter())
  }
})

form.addEventListener('submit', async event => {
  event.preventDefault()
  submit.disabled = true
  player.hidden = true
  statusEl.textContent = '正在生成…'

  const formData = new FormData(form)
  const payload = Object.fromEntries(formData.entries())
  payload.rate = formatPercent(payload.rate)
  payload.pitch = formatPercent(payload.pitch)
  payload.volume = formatPercent(payload.volume)
  payload.timeout = Number(payload.timeout) * 1000

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '语音生成失败')

    const audioUrl = `${result.audioUrl}?t=${Date.now()}`
    audio.src = audioUrl
    download.href = result.audioUrl
    player.hidden = false
    statusEl.textContent = '生成完成'
    await audio.play().catch(() => undefined)
  } catch (error) {
    statusEl.textContent = error.message || '语音生成失败'
  } finally {
    submit.disabled = false
  }
})
