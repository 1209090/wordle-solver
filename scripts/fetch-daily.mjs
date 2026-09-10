import { writeFileSync } from 'node:fs';

const OUTPUT_PATH = 'daily.json';
const API_URL = 'https://api-wordle.secretwall.ru/v1/daily?lang=ru';

const response = await fetch(API_URL);
if (!response.ok) throw new Error(`Daily word API returned HTTP ${response.status}`);

const data = (await response.json())?.data;
const word = data?.word?.toLowerCase();
const day = data?.day;
if (typeof word !== 'string' || word.length !== 5 || !Number.isInteger(day)) {
  throw new Error('Daily word API returned an unexpected response');
}

writeFileSync(OUTPUT_PATH, JSON.stringify({ word, day }, null, 2) + '\n');
console.log(`Updated ${OUTPUT_PATH}`);
