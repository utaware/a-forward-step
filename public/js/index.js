const form = document.querySelector('#tts-form')
const text = document.querySelector('#text')
const count = document.querySelector('#count')
const voice = document.querySelector('#voice')
const lang = document.querySelector('#lang')
const submit = document.querySelector('#submit')
const status = document.querySelector('#status')
const player = document.querySelector('#player')
const audio = document.querySelector('#audio')
const download = document.querySelector('#download')

function updateCount() {
  count.textContent = `${text.value.length} / 3000`
}

function formatPercent(value) {
  const number = Number(value)
  return `${number >= 0 ? '+' : ''}${number}%`
}

document.querySelectorAll('input[type="range"]').forEach(input => {
  const output = input.parentElement.querySelector('output')
  input.addEventListener('input', () => {
    output.value = formatPercent(input.value)
  })
})

voice.addEventListener('change', () => {
  lang.value = voice.selectedOptions[0].dataset.lang
})
text.addEventListener('input', updateCount)
updateCount()

form.addEventListener('submit', async event => {
  event.preventDefault()
  submit.disabled = true
  player.hidden = true
  status.textContent = '正在生成…'

  const formData = new FormData(form)
  const payload = Object.fromEntries(formData.entries())
  payload.rate = formatPercent(payload.rate)
  payload.pitch = formatPercent(payload.pitch)
  payload.volume = formatPercent(payload.volume)
  payload.timeout = Number(payload.timeout)

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
    status.textContent = '生成完成'
    await audio.play().catch(() => undefined)
  } catch (error) {
    status.textContent = error.message || '语音生成失败'
  } finally {
    submit.disabled = false
  }
})
