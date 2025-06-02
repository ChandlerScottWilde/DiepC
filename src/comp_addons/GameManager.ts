//Extremely simple file that keeps track of all active games, so other games can access them

import GameServer from "../Game";

const games: GameServer[] = [];

export function registerGame(game: GameServer) {
    games.push(game);
}

export function getAllGames(): GameServer[] {
    return [...games]; // Return a shallow copy
}
