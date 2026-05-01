import { ref } from 'vue'
import { macFormats } from '../utils/mac.js'
import { copyText } from '../utils/misc.js'

export function useMacDrop(showToast) {
  const macDrop = ref(null)
  let macTimer = null
  let macShowTimer = null

  function openMacDrop(e, raw, userId) {
    e.stopPropagation()
    const fmt = macFormats(raw)
    if (!fmt) return

    const rect = e.currentTarget.getBoundingClientRect()
    const dW = 245, dH = 114
    let left = rect.left
    if (left + dW > window.innerWidth - 8) left = window.innerWidth - dW - 8
    const top = (rect.bottom + dH + 8 > window.innerHeight)
      ? rect.top - dH - 4
      : rect.bottom + 4

    macDrop.value = { formats: fmt, userId, copiedKey: null, top, left, visible: false }

    if (macShowTimer) clearTimeout(macShowTimer)
    macShowTimer = setTimeout(() => {
      if (macDrop.value) macDrop.value = { ...macDrop.value, visible: true }
    }, 10)

    if (macTimer) clearTimeout(macTimer)
    macTimer = setTimeout(() => { macDrop.value = null }, 4000)
  }

  function copyMacFmt(e, key) {
    e.stopPropagation()
    if (!macDrop.value) return
    copyText(macDrop.value.formats[key])
    macDrop.value = { ...macDrop.value, copiedKey: key }
    if (macTimer) clearTimeout(macTimer)
    macTimer = setTimeout(() => { macDrop.value = null }, 1500)
    showToast('✓ MAC скопирован')
  }

  function closeMacDrop() {
    macDrop.value = null
  }

  // Закрываем при клике мимо
  document.addEventListener('click', closeMacDrop)

  return { macDrop, openMacDrop, copyMacFmt }
}
