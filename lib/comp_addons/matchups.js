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
exports.loadMatchups = loadMatchups;
exports.getRandomMatchup = getRandomMatchup;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const filePath = path.join(__dirname, 'matchups.json');
function loadMatchups() {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(rawData);
    return json.map((item) => item.matchup);
}
function getRandomMatchup() {
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
    return matchups[matchups.length - 1];
}
