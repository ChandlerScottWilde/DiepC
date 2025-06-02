"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompLobbyShapeManager = void 0;
const Arena_1 = __importDefault(require("../Native/Arena"));
const Manager_1 = __importDefault(require("../Entity/Shape/Manager"));
const MazeWall_1 = __importDefault(require("../Entity/Misc/MazeWall"));
class CompLobbyShapeManager extends Manager_1.default {
    get wantedShapes() {
        return 0;
    }
}
exports.CompLobbyShapeManager = CompLobbyShapeManager;
class CompLobbyArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new CompLobbyShapeManager(this);
        this.updateBounds(4000, 4500);
        const w1 = new MazeWall_1.default(this.game, 0, 2020, 1350, 3630);
    }
    tick(tick) {
        const arenaWidth = 3630;
        const arenaHeight = 4600;
        if (this.width !== arenaWidth || this.height !== arenaHeight)
            this.updateBounds(arenaWidth, arenaHeight);
        super.tick(tick);
    }
}
exports.default = CompLobbyArena;
