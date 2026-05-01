/** Простой хэш строки → число. Используется для выбора цвета департамента */
export function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Ищет ключ в строке Excel без учёта регистра и пробелов */
export function findKey(row, field) {
  const n = field.trim().toLowerCase()
  return Object.keys(row).find(k => k.trim().toLowerCase() === n) || null
}

/** Считает значение "включено" для чекбокс-полей */
export function isOn(v) {
  return ['да', 'yes', '1', 'true', '+'].includes((v || '').trim().toLowerCase())
}

/** Копирует текст в буфер — сначала Clipboard API, fallback через execCommand */
export function copyText(text) {
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {})
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}
