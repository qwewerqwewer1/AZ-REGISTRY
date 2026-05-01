import * as XLSX from 'xlsx'
import { FIELDS } from '../constants/index.js'
import { findKey } from './misc.js'

/** Читает .xlsx/.xls файл, возвращает массив объектов с полями из FIELDS */
export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' })
        resolve(
          rows.map(row => {
            const obj = {}
            FIELDS.forEach(f => {
              const k = findKey(row, f)
              obj[f] = k ? String(row[k] ?? '') : ''
            })
            return obj
          })
        )
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

/** Экспортирует массив записей в .xlsx файл и скачивает его */
export function exportExcel(data) {
  const rows = data.map(u => {
    const r = {}
    FIELDS.forEach(f => { r[f] = u[f] ?? '' })
    return r
  })
  const ws = XLSX.utils.json_to_sheet(rows, { header: FIELDS })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Реестр')
  XLSX.writeFile(wb, 'it-registry-export.xlsx')
}
