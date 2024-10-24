export function getSchemaKey(key: string): string {
  return key === 'id' ? '_id' : key;
}

export function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(/[\s-_]+/) // Split by spaces, hyphens, or underscores
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

export function upperCaseFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowerCaseFirst(str) {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
};
