/**
 * Safe decimal helpers — avoids JS floating-point drift
 * by operating on scaled integers where possible.
 */

/** Round a number to N decimal places */
export function roundTo(num, dp) {
  return Math.round(num * Math.pow(10, dp)) / Math.pow(10, dp);
}

/** Format a number to exactly N decimal places as a string */
export function formatDecimal(num, dp = 2) {
  return Number(num).toFixed(dp);
}

/** Parse a decimal string safely, returns NaN if invalid */
export function parseDecimal(str) {
  const n = parseFloat(str);
  return isNaN(n) ? NaN : n;
}

/**
 * Compare two decimals.
 * Returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareDecimals(a, b) {
  const diff = roundTo(a - b, 10);
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/** Get the digit in the given place: 'ones' | 'tenths' | 'hundredths' */
export function getDigitAt(num, place) {
  if (place === 'ones') return Math.floor(Math.abs(num)) % 10;
  if (place === 'tenths') return Math.floor(roundTo(Math.abs(num) * 10, 6)) % 10;
  if (place === 'hundredths') return Math.floor(roundTo(Math.abs(num) * 100, 6)) % 10;
  return 0;
}

/** Get the place value (as a decimal) at a given place */
export function getPlaceValue(num, place) {
  const digit = getDigitAt(num, place);
  if (place === 'ones') return digit;
  if (place === 'tenths') return digit * 0.1;
  if (place === 'hundredths') return digit * 0.01;
  return 0;
}

/** Round to nearest whole number */
export function roundToWhole(num) {
  return Math.round(num);
}

/** Round to nearest tenth */
export function roundToTenth(num) {
  return roundTo(num, 1);
}

/** Convert simple fraction (tenths/hundredths) to decimal string */
export function fractionToDecimal(numerator, denominator) {
  if (denominator !== 10 && denominator !== 100) return null;
  return formatDecimal(numerator / denominator, denominator === 100 ? 2 : 1);
}

/** Convert decimal to fraction string e.g. 0.3 → "3/10", 0.75 → "75/100" */
export function decimalToFraction(num) {
  const str = String(roundTo(num, 2));
  const dp = (str.split('.')[1] || '').length;
  if (dp === 0) return `${num}/1`;
  if (dp === 1) return `${Math.round(num * 10)}/10`;
  return `${Math.round(num * 100)}/100`;
}

/** Add two decimals safely */
export function addDecimals(a, b) {
  return roundTo(a + b, 2);
}

/** Subtract two decimals safely */
export function subtractDecimals(a, b) {
  return roundTo(a - b, 2);
}

/** Sort array of decimals ascending */
export function sortDecimals(arr) {
  return [...arr].sort((a, b) => compareDecimals(a, b));
}

/** Check if two decimal strings represent equal values (trailing zero insensitive) */
export function decimalsEqual(a, b) {
  return parseFloat(a) === parseFloat(b);
}
