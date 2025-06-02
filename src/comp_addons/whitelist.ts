import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'whitelist.json');

interface Player {
  username: string;
  password: string;
  elo: number;
  online: boolean;
}

interface WhitelistData {
  players: Player[];
}

function loadPlayers(): WhitelistData {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as WhitelistData;
  } catch (err) {
    console.error('Failed to load whitelist.json:', err);
    return { players: [] };
  }
}

function savePlayers(players: WhitelistData): void {
  fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
}

function findPlayer(username: string): Player | undefined {
  const whitelist = loadPlayers();
  const player = whitelist.players.find(p => p.username === username);
  return player;
}

function authenticate(username: string, password: string): boolean {
  const player = findPlayer(username);
  return !!player && player.password === password;
}

function setOnline(username: string, online: boolean): void {
  const whitelist = loadPlayers();
  const player = whitelist.players.find(p => p.username === username);
  if (player) {
    player.online = online;
    savePlayers(whitelist);
  }
}

function updateElo(username: string, newElo: number): void {
  const whitelist = loadPlayers();
  const player = whitelist.players.find(p => p.username === username);
  if (player) {
    player.elo = newElo;
    savePlayers(whitelist);
  }
}

export {
  loadPlayers,
  savePlayers,
  findPlayer,
  authenticate,
  setOnline,
  updateElo,
  Player
};
