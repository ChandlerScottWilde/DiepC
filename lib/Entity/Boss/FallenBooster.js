"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = __importDefault(require("../Tank/Barrel"));
const TankDefinitions_1 = __importDefault(require("../../Const/TankDefinitions"));
const AbstractBoss_1 = __importDefault(require("./AbstractBoss"));
const Enums_1 = require("../../Const/Enums");
class FallenBooster extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.movementSpeed = 1;
        this.nameData.values.name = 'Fallen Booster';
        for (const barrelDefinition of TankDefinitions_1.default[Enums_1.Tank.Booster].barrels) {
            const def = Object.assign({}, barrelDefinition, {});
            def.bullet = Object.assign({}, def.bullet, { speed: 1.7, health: 6.25 });
            this.barrels.push(new Barrel_1.default(this, def));
        }
    }
    get sizeFactor() {
        return this.physicsData.values.size / 50;
    }
    moveAroundMap() {
        const x = this.positionData.values.x, y = this.positionData.values.y;
        if (this.ai.state === 0) {
            super.moveAroundMap();
            this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
        }
        else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = FallenBooster;
