import { FIELDS } from "./constants.js";
import { findExcelKey } from "./utils.js";

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const normalizedRows = rawRows.map((row) => {
          const next = {};

          FIELDS.forEach((fieldName) => {
            const sourceKey = findExcelKey(row, fieldName);
            next[fieldName] = sourceKey
              ? row[sourceKey] != null
                ? String(row[sourceKey])
                : ""
              : "";
          });

          return next;
        });

        resolve(normalizedRows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
