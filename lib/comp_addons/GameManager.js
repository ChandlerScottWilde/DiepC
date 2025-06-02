"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGame = registerGame;
exports.getAllGames = getAllGames;
const games = [];
function registerGame(game) {
    games.push(game);
}
function getAllGames() {
    return [...games];
}
