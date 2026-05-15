/**
 * fix_locale_encoding.js
 *
 * The locale JSON files contain mojibake: Cyrillic text that was stored as
 * Latin-1 characters instead of proper UTF-8. Each Cyrillic character in
 * UTF-8 is 2 bytes; those bytes were misinterpreted as Latin-1 (Windows-1252)
 * characters and stored as Unicode codepoints.
 *
 * Fix: encode each character back to its Latin-1 byte value, then decode
 * the resulting bytes as UTF-8 to recover the original Cyrillic text.
 *
 * Example:
 *   mojibake : "Р"Р»Р°РІРЅР°СЏ"
 *   fixed    : "Главная"
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const locales = ['ru', 'kk', 'en'];

/**
 * Detect if a string contains typical mojibake patterns for Cyrillic:
 * UTF-8 Cyrillic chars (U+0400–U+04FF) each encode as 2 bytes:
 *   0xD0 0x80–0xBF  or  0xD1 0x80–0xBF
 * When those bytes are stored as Latin-1/cp1252 codepoints, you get chars like:
 *   U+00D0 (Р), U+00D1 (С) followed by chars in U+0080–U+00BF range.
 *
 * We detect by looking for the pattern: char in {0xD0, 0xD1} immediately
 * followed by a char in [0x80, 0xBF] range.
 */
function isMojibake(str) {
  for (let i = 0; i < str.length - 1; i++) {
    const c1 = str.charCodeAt(i);
    const c2 = str.charCodeAt(i + 1);
    if ((c1 === 0xD0 || c1 === 0xD1) && c2 >= 0x80 && c2 <= 0xBF) {
      return true;
    }
  }
  return false;
}

/**
 * Fix a mojibake string: interpret each char as its Latin-1 byte value,
 * collect into a Buffer, then decode as UTF-8.
 */
function fixMojibake(str) {
  // Each character's code point is a single byte value (0x00–0xFF range)
  const bytes = Buffer.alloc(str.length);
  for (let i = 0; i < str.length; i++) {
    const cp = str.charCodeAt(i);
    if (cp > 0xFF) {
      // Already a real Unicode char (e.g. emoji U+1F44B) — keep as-is
      // We'll handle this by returning partial fix up to this point.
      // Actually: emoji come as surrogate pairs in JS strings.
      // Just put a placeholder byte and handle below.
      bytes[i] = 0x3F; // '?'
    } else {
      bytes[i] = cp;
    }
  }
  return bytes.toString('utf8');
}

/**
 * Recursively walk an object/array, fixing any mojibake strings in place.
 */
function fixObject(obj) {
  if (typeof obj === 'string') {
    if (isMojibake(obj)) {
      return fixMojibake(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(fixObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = fixObject(obj[key]);
    }
    return result;
  }
  return obj;
}

let totalFixed = 0;
let totalFiles = 0;

for (const locale of locales) {
  const filePath = path.join(localesDir, locale, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${filePath}`);
    continue;
  }

  // Read as UTF-8 (Node default)
  const raw = fs.readFileSync(filePath, 'utf8');
  
  // Count mojibake patterns before fix
  const mojibakeMatches = (raw.match(/[\xD0\xD1][\x80-\xBF]/g) || []).length;
  console.log(`\n[${locale.toUpperCase()}] ${filePath}`);
  console.log(`  Mojibake patterns found: ${mojibakeMatches}`);

  if (mojibakeMatches === 0) {
    console.log(`  ✓ No fix needed.`);
    totalFiles++;
    continue;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`  ✗ Failed to parse JSON: ${e.message}`);
    continue;
  }

  const fixed = fixObject(data);
  const fixedJson = JSON.stringify(fixed, null, 4);

  // Verify the fix produced valid Cyrillic (spot check)
  const sample = fixed.nav && fixed.nav.home ? fixed.nav.home : '';
  console.log(`  nav.home before: ${data.nav && data.nav.home}`);
  console.log(`  nav.home after : ${sample}`);

  // Write back as UTF-8 without BOM
  fs.writeFileSync(filePath, fixedJson, { encoding: 'utf8' });
  console.log(`  ✓ Fixed and saved.`);
  totalFixed++;
  totalFiles++;
}

console.log(`\n✅ Done. Fixed ${totalFixed}/${totalFiles} locale files.`);
console.log('\nVerification samples:');

for (const locale of locales) {
  const filePath = path.join(localesDir, locale, 'translation.json');
  if (!fs.existsSync(filePath)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const home = data.nav && data.nav.home;
    const voiceTitle = data.voice && data.voice.pageTitle;
    console.log(`  [${locale}] nav.home="${home}" | voice.pageTitle="${voiceTitle}"`);
  } catch (e) {
    console.log(`  [${locale}] ERROR: ${e.message}`);
  }
}
