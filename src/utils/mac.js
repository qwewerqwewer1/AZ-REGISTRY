/** Убирает все разделители, возвращает строку из 12 hex-символов нижнего регистра */
export function normalizeMac(s) {
  return (s || '').toLowerCase().replace(/[:\-.]/g, '').replace(/\s/g, '')
}

/**
 * Возвращает объект с тремя форматами MAC или null если строка невалидна.
 * @returns {{ colon: string, hyphen: string, cisco: string } | null}
 */
export function macFormats(raw) {
  const c = normalizeMac(raw)
  if (c.length !== 12) return null
  const b = c.match(/.{2}/g)
  return {
    colon:  b.join(':').toUpperCase(),
    hyphen: b.join('-').toUpperCase(),
    cisco:  [b.slice(0, 2).join(''), b.slice(2, 4).join(''), b.slice(4, 6).join('')].join('.').toUpperCase(),
  }
}
