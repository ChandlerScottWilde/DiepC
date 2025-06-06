"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = __importDefault(require("../../Tank/Barrel"));
const TankDefinitions_1 = __importDefault(require("../../../Const/TankDefinitions"));
const AbstractBoss_1 = __importDefault(require("../../Boss/AbstractBoss"));
const Enums_1 = require("../../../Const/Enums");
class FallenAC extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Fallen Arena Closer';
        this.movementSpeed = 20;
        for (const barrelDefinition of TankDefinitions_1.default[Enums_1.Tank.ArenaCloser].barrels) {
            this.barrels.push(new Barrel_1.default(this, barrelDefinition));
        }
    }
    get sizeFactor() {
        return this.physicsData.values.size / 50;
    }
    moveAroundMap() {
        if (this.ai.state === 0) {
            this.positionData.angle += this.ai.passiveRotation;
            this.accel.set({ x: 0, y: 0 });
        }
        else {
            const x = this.positionData.values.x, y = this.positionData.values.y;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = FallenAC;
