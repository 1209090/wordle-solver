import { readFileSync, writeFileSync } from 'node:fs';

const OUTPUT_PATH = 'daily.json';
const API_URL = 'https://api-wordle.secretwall.ru/v1/daily?lang=ru';
const today = new Date().toISOString().slice(0, 10);

const current = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
if (current.date === today) {
  console.log(`${OUTPUT_PATH} is already current; skipping the API request`);
  process.exit(0);
}

const response = await fetch(API_URL);
if (!response.ok) throw new Error(`Daily word API returned HTTP ${response.status}`);

const data = (await response.json())?.data;
const word = data?.word?.toLowerCase();
const day = data?.day;
if (typeof word !== 'string' || word.length !== 5 || !Number.isInteger(day)) {
  throw new Error('Daily word API returned an unexpected response');
}
if (Number.isInteger(current.day) && day <= current.day) {
  console.log('The API has not published a new daily word yet');
  process.exit(0);
}

writeFileSync(OUTPUT_PATH, JSON.stringify({ word, day, date: today }, null, 2) + '\n');
console.log(`Updated ${OUTPUT_PATH}`);
