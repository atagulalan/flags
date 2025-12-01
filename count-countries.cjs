// Quick script to count countries
const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, 'src/data/countries.ts'), 'utf8');

// Extract all level arrays
const level1Match = file.match(/const level1: Country\[\] = \[([\s\S]*?)\];/);
const level2Match = file.match(/const level2: Country\[\] = \[([\s\S]*?)\];/);
const level3Match = file.match(/const level3: Country\[\] = \[([\s\S]*?)\];/);
const level4Match = file.match(/const level4: Country\[\] = \[([\s\S]*?)\];/);

function extractCodes(content) {
  if (!content) return [];
  const codeMatches = content.match(/code: '([A-Z]{2})'/g);
  if (!codeMatches) return [];
  return codeMatches.map(m => {
    const match = m.match(/'([A-Z]{2})'/);
    return match ? match[1] : null;
  }).filter(Boolean);
}

const level1Codes = extractCodes(level1Match ? level1Match[1] : '');
const level2Codes = extractCodes(level2Match ? level2Match[1] : '');
const level3Codes = extractCodes(level3Match ? level3Match[1] : '');
const level4Codes = extractCodes(level4Match ? level4Match[1] : '');

console.log('Level 1 entries:', level1Codes.length);
console.log('Level 2 entries:', level2Codes.length);
console.log('Level 3 entries:', level3Codes.length);
console.log('Level 4 entries:', level4Codes.length);

// Level4 includes level3 via spread, so we need to count all unique codes
const allCodes = [...level1Codes, ...level2Codes, ...level3Codes, ...level4Codes];
const uniqueCodes = new Set(allCodes);

console.log('\n=== SUMMARY ===');
console.log('Total entries (all levels):', allCodes.length);
console.log('Unique country codes:', uniqueCodes.size);

if (allCodes.length !== uniqueCodes.size) {
  console.log('\n⚠️  DUPLICATES FOUND!');
  const duplicates = allCodes.filter((code, index) => allCodes.indexOf(code) !== index);
  const uniqueDuplicates = [...new Set(duplicates)];
  console.log('Duplicate codes:', uniqueDuplicates.join(', '));
  
  // Show where duplicates are
  uniqueDuplicates.forEach(code => {
    const indices = allCodes.map((c, i) => c === code ? i : -1).filter(i => i !== -1);
    console.log(`  ${code}: appears at indices ${indices.join(', ')}`);
  });
} else {
  console.log('\n✅ No duplicates found!');
}

// Check level4 specifically (it should include level3 via spread)
console.log('\n=== LEVEL 4 ANALYSIS ===');
console.log('Level 4 array has', level4Codes.length, 'direct entries');
console.log('(Note: Level 4 includes Level 3 via spread operator, so actual count is higher)');

