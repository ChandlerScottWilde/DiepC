import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'matchups.json');

// Define the structure of a tank
export type Mtank = {
  name: string;
  level: number;
  stats: number[];
};

// Update Matchup to use Tank objects instead of plain numbers
export type Matchup = {
  a: Mtank;
  b: Mtank;
  weight: number;
};

export function loadMatchups(): Matchup[] {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(rawData);
  return json.map((item: { matchup: Matchup }) => item.matchup);
}

export function getRandomMatchup(): Matchup {
  const matchups = loadMatchups();
  const totalWeight = matchups.reduce((sum, m) => sum + m.weight, 0);

  if (totalWeight <= 0) {
    throw new Error("Invalid weights: total weight must be greater than 0");
  }

  const r = Math.random() * totalWeight;
  let cumulative = 0;

  for (const matchup of matchups) {
    cumulative += matchup.weight;
    if (r < cumulative) {
      return matchup;
    }
  }

  // Fallback
  return matchups[matchups.length - 1];
}
