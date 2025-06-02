"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPlayers = loadPlayers;
exports.savePlayers = savePlayers;
exports.findPlayer = findPlayer;
exports.authenticate = authenticate;
exports.setOnline = setOnline;
exports.updateElo = updateElo;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const filePath = path.join(__dirname, 'whitelist.json');
function loadPlayers() {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }
    catch (err) {
        console.error('Failed to load whitelist.json:', err);
        return { players: [] };
    }
}
function savePlayers(players) {
    fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
}
function findPlayer(username) {
    const whitelist = loadPlayers();
    const player = whitelist.players.find(p => p.username === username);
    return player;
}
function authenticate(username, password) {
    const player = findPlayer(username);
    return !!player && player.password === password;
}
function setOnline(username, online) {
    const whitelist = loadPlayers();
    const player = whitelist.players.find(p => p.username === username);
    if (player) {
        player.online = online;
        savePlayers(whitelist);
    }
}
function updateElo(username, newElo) {
    const whitelist = loadPlayers();
    const player = whitelist.players.find(p => p.username === username);
    if (player) {
        player.elo = newElo;
        savePlayers(whitelist);
    }
}
