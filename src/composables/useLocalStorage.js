import { watch } from 'vue'
import { LS_KEY } from '../constants/index.js'

/** Загружает данные из localStorage. Возвращает { data, idCounter } или null */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.data?.length) return parsed
  } catch (_) {}
  return null
}

/** Запускает авто-сохранение при изменении data (deep watch) */
export function watchAndSave(data, idCounter) {
  watch(
    data,
    () => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({
          data: data.value,
          idCounter: idCounter.value,
        }))
      } catch (_) {}
    },
    { deep: true }
  )
}
