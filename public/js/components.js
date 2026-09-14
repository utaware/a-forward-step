class TtsSelectField extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return

    const options = this.innerHTML
    const inputId = this.getAttribute('input-id')
    const name = this.getAttribute('name')
    const label = this.getAttribute('label')

    this.classList.add('d-block', 'mb-3')
    this.innerHTML = `
      <label class="form-label small fw-bold" for="${inputId}">${label}</label>
      <select class="form-select" id="${inputId}" name="${name}">${options}</select>
    `
    this.dataset.ready = 'true'
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
      <label class="form-label small fw-bold" for="${inputId}">${label}</label>
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

customElements.define('tts-select-field', TtsSelectField)
customElements.define('tts-range-field', TtsRangeField)
