export const camelToKebab = (str) => str.replace(/(?=\w)([A-Z])/g, "-$1").toLowerCase();
export const camelToSnake = (str) => str.replace(/(?=\w)([A-Z])/g, "_$1").toLowerCase();
export const kebabToCamel = (str) => str.replace(/\-([a-z])/g, (m) => m[1].toUpperCase());
export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (m) => m[1].toUpperCase());

export const ucFirst = (str) => str.replace(/^([a-z])/, (m) => m[1].toUpperCase());
export const ucWords = (str) => str.replace(/\b([a-z])/g, (m) => m[1].toUpperCase());
