"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelToScoreTable = exports.StatCount = exports.Tank = exports.ColorsHexCode = void 0;
exports.levelToScore = levelToScore;
const config_1 = require("../config");
exports.ColorsHexCode = {
    [0]: 0x555555,
    [1]: 0x999999,
    [2]: 0x00B2E1,
    [3]: 0x00B2E1,
    [4]: 0xF14E54,
    [5]: 0xBF7FF5,
    [6]: 0x00E16E,
    [7]: 0x8AFF69,
    [8]: 0xFFE869,
    [9]: 0xFC7677,
    [10]: 0x768DFC,
    [11]: 0xF177DD,
    [12]: 0xFFE869,
    [13]: 0x43FF91,
    [14]: 0xBBBBBB,
    [15]: 0xF14E54,
    [16]: 0xFCC376,
    [17]: 0xC0C0C0,
    [18]: 0x000000
};
var Tank;
(function (Tank) {
    Tank[Tank["Basic"] = 0] = "Basic";
    Tank[Tank["Twin"] = 1] = "Twin";
    Tank[Tank["Triplet"] = 2] = "Triplet";
    Tank[Tank["TripleShot"] = 3] = "TripleShot";
    Tank[Tank["QuadTank"] = 4] = "QuadTank";
    Tank[Tank["OctoTank"] = 5] = "OctoTank";
    Tank[Tank["Sniper"] = 6] = "Sniper";
    Tank[Tank["MachineGun"] = 7] = "MachineGun";
    Tank[Tank["FlankGuard"] = 8] = "FlankGuard";
    Tank[Tank["TriAngle"] = 9] = "TriAngle";
    Tank[Tank["Destroyer"] = 10] = "Destroyer";
    Tank[Tank["Overseer"] = 11] = "Overseer";
    Tank[Tank["Overlord"] = 12] = "Overlord";
    Tank[Tank["TwinFlank"] = 13] = "TwinFlank";
    Tank[Tank["PentaShot"] = 14] = "PentaShot";
    Tank[Tank["Assassin"] = 15] = "Assassin";
    Tank[Tank["ArenaCloser"] = 16] = "ArenaCloser";
    Tank[Tank["Necromancer"] = 17] = "Necromancer";
    Tank[Tank["TripleTwin"] = 18] = "TripleTwin";
    Tank[Tank["Hunter"] = 19] = "Hunter";
    Tank[Tank["Gunner"] = 20] = "Gunner";
    Tank[Tank["Stalker"] = 21] = "Stalker";
    Tank[Tank["Ranger"] = 22] = "Ranger";
    Tank[Tank["Booster"] = 23] = "Booster";
    Tank[Tank["Fighter"] = 24] = "Fighter";
    Tank[Tank["Hybrid"] = 25] = "Hybrid";
    Tank[Tank["Manager"] = 26] = "Manager";
    Tank[Tank["Mothership"] = 27] = "Mothership";
    Tank[Tank["Predator"] = 28] = "Predator";
    Tank[Tank["Sprayer"] = 29] = "Sprayer";
    Tank[Tank["Trapper"] = 30] = "Trapper";
    Tank[Tank["GunnerTrapper"] = 32] = "GunnerTrapper";
    Tank[Tank["Overtrapper"] = 33] = "Overtrapper";
    Tank[Tank["MegaTrapper"] = 34] = "MegaTrapper";
    Tank[Tank["TriTrapper"] = 35] = "TriTrapper";
    Tank[Tank["Smasher"] = 36] = "Smasher";
    Tank[Tank["Landmine"] = 37] = "Landmine";
    Tank[Tank["AutoGunner"] = 39] = "AutoGunner";
    Tank[Tank["Auto5"] = 40] = "Auto5";
    Tank[Tank["Auto3"] = 41] = "Auto3";
    Tank[Tank["SpreadShot"] = 42] = "SpreadShot";
    Tank[Tank["Streamliner"] = 43] = "Streamliner";
    Tank[Tank["AutoTrapper"] = 44] = "AutoTrapper";
    Tank[Tank["DominatorD"] = 45] = "DominatorD";
    Tank[Tank["DominatorG"] = 46] = "DominatorG";
    Tank[Tank["DominatorT"] = 47] = "DominatorT";
    Tank[Tank["Battleship"] = 48] = "Battleship";
    Tank[Tank["Annihilator"] = 49] = "Annihilator";
    Tank[Tank["AutoSmasher"] = 50] = "AutoSmasher";
    Tank[Tank["Spike"] = 51] = "Spike";
    Tank[Tank["Factory"] = 52] = "Factory";
    Tank[Tank["Skimmer"] = 54] = "Skimmer";
    Tank[Tank["Rocketeer"] = 55] = "Rocketeer";
})(Tank || (exports.Tank = Tank = {}));
exports.StatCount = 8;
exports.levelToScoreTable = Array(config_1.maxPlayerLevel).fill(0);
for (let i = 1; i < config_1.maxPlayerLevel; ++i) {
    exports.levelToScoreTable[i] = exports.levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}
function levelToScore(level) {
    if (level >= config_1.maxPlayerLevel)
        return exports.levelToScoreTable[config_1.maxPlayerLevel - 1];
    if (level <= 0)
        return 0;
    return exports.levelToScoreTable[level - 1];
}
