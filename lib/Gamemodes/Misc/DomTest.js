"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = __importDefault(require("../../Native/Arena"));
const Enums_1 = require("../../Const/Enums");
const Dominator_1 = __importDefault(require("../../Entity/Misc/Dominator"));
const TeamBase_1 = __importDefault(require("../../Entity/Misc/TeamBase"));
const Sandbox_1 = require("../Sandbox");
class SpikeboxArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new Sandbox_1.SandboxShapeManager(this);
        this.updateBounds(2500, 2500);
        const spike = new Dominator_1.default(this, new TeamBase_1.default(game, this, 0, 0, 750, 750, false), Enums_1.Tank.Spike);
        spike.nameData.flags &= ~1;
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = SpikeboxArena;
