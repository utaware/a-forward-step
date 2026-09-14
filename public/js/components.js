const voices = [
  { value: 'zh-CN-XiaoxiaoNeural', label: '晓晓 · 中文女声', lang: 'zh-CN' },
  { value: 'zh-CN-YunxiNeural', label: '云希 · 中文男声', lang: 'zh-CN' },
  { value: 'zh-CN-YunjianNeural', label: '云健 · 中文男声', lang: 'zh-CN' },
  { value: 'zh-TW-HsiaoChenNeural', label: '曉臻 · 繁体女声', lang: 'zh-TW' },
  { value: 'en-US-AriaNeural', label: 'Aria · English', lang: 'en-US' },
  { value: 'en-US-GuyNeural', label: 'Guy · English', lang: 'en-US' },
  { value: 'ja-JP-NanamiNeural', label: 'Nanami · 日本語', lang: 'ja-JP' },
]

const outputFormats = [
  { value: 'audio-16khz-32kbitrate-mono-mp3', label: '16 kHz · 32 kbps' },
  { value: 'audio-24khz-48kbitrate-mono-mp3', label: '24 kHz · 48 kbps' },
  { value: 'audio-24khz-96kbitrate-mono-mp3', label: '24 kHz · 96 kbps' },
]

class TtsSelectField extends HTMLElement {
  get options() {
    return []
  }

  connectedCallback() {
    if (this.dataset.ready) return

    const inputId = this.getAttribute('input-id')
    const name = this.getAttribute('name')
    const label = this.getAttribute('label')
    const defaultValue = this.getAttribute('default-value') || this.options[0]?.value || ''

    this.classList.add('d-block', 'mb-3')
    this.innerHTML = `
      <label class="form-label small fw-bold" for="${inputId}" title="重置为默认值">${label}</label>
      <select class="form-select" id="${inputId}" name="${name}"></select>
    `

    const select = this.querySelector('select')
    const labelEl = this.querySelector('label')
    this.options.forEach(option => {
      const optionEl = document.createElement('option')
      optionEl.value = option.value
      optionEl.textContent = option.label
      if (option.lang) optionEl.dataset.lang = option.lang
      select.append(optionEl)
    })
    select.value = defaultValue

    labelEl.addEventListener('click', () => {
      select.value = defaultValue
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    this.dataset.ready = 'true'
  }
}

class TtsVoiceField extends TtsSelectField {
  get options() {
    return voices
  }

  connectedCallback() {
    if (this.dataset.ready) return

    this.setAttribute('label', '音色')
    this.setAttribute('input-id', 'voice')
    this.setAttribute('name', 'voice')
    this.setAttribute('default-value', 'zh-CN-XiaoxiaoNeural')
    super.connectedCallback()

    const select = this.querySelector('select')
    const langInput = document.createElement('input')
    langInput.type = 'hidden'
    langInput.name = 'lang'
    this.append(langInput)

    const syncLanguage = () => {
      langInput.value = select.selectedOptions[0]?.dataset.lang || 'zh-CN'
    }
    select.addEventListener('change', syncLanguage)
    syncLanguage()
  }
}

class TtsOutputFormatField extends TtsSelectField {
  get options() {
    return outputFormats
  }

  connectedCallback() {
    if (this.dataset.ready) return

    this.setAttribute('label', '输出音质')
    this.setAttribute('input-id', 'outputFormat')
    this.setAttribute('name', 'outputFormat')
    this.setAttribute('default-value', 'audio-24khz-48kbitrate-mono-mp3')
    super.connectedCallback()
  }
}

class TtsRangeField extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return

    const inputId = this.getAttribute('input-id')
    const name = this.getAttribute('name')
    const label = this.getAttribute('label')
    const min = this.getAttribute('min')
    const max = this.getAttribute('max')
    const step = this.getAttribute('step') || '1'
    const value = this.getAttribute('value') || '0'

    this.classList.add('d-block', 'mb-3')
    this.innerHTML = `
      <label class="form-label small fw-bold" for="${inputId}" title="重置为默认值">${label}</label>
      <div class="d-flex align-items-center gap-3">
        <input class="form-range" id="${inputId}" name="${name}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
        <output for="${inputId}"></output>
      </div>
    `

    const input = this.querySelector('input')
    const output = this.querySelector('output')
    const labelEl = this.querySelector('label')
    const updateOutput = () => {
      const number = Number(input.value)
      output.value = this.hasAttribute('percent') ? `${number >= 0 ? '+' : ''}${number}%` : `${number} s`
    }

    const resetOutput = () => {
      input.value = value
      updateOutput()
    }

    input.addEventListener('input', updateOutput)
    labelEl.addEventListener('click', resetOutput)
    updateOutput()
    this.dataset.ready = 'true'
  }
}

customElements.define('tts-range-field', TtsRangeField)
customElements.define('tts-select-field', TtsSelectField)
customElements.define('tts-voice-field', TtsVoiceField)
customElements.define('tts-output-format-field', TtsOutputFormatField)
