export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function findExcelKey(row, fieldName) {
  const normalizedFieldName = fieldName.trim().toLowerCase();
  const foundKey = Object.keys(row).find(
    (key) => key.trim().toLowerCase() === normalizedFieldName,
  );
  return foundKey || null;
}

export function filterByQuery(items, query, keys) {
  const normalizedQuery = (query || "").toLowerCase().trim();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    keys.some((key) =>
      (item[key] || "").toLowerCase().includes(normalizedQuery),
    ),
  );
}
