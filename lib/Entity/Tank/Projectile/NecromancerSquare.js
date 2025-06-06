"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drone_1 = __importDefault(require("./Drone"));
const Enums_1 = require("../../../Const/Enums");
const AI_1 = require("../../AI");
class NecromancerSquare extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        const bulletDefinition = barrel.definition.bullet;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 900;
        this.physicsData.values.sides = 4;
        this.styleData.values.color = tank.relationsData.values.team?.teamData?.values.teamColor || 16;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        if (tankDefinition && tankDefinition.id === Enums_1.Tank.Battleship) {
            this.lifeLength = 88;
        }
        else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & 256)
                this.physicsData.values.flags ^= 256;
        }
        this.deathAccelFactor = 1;
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed = 0;
    }
    static fromShape(barrel, tank, tankDefinition, shape) {
        const sunchip = new NecromancerSquare(barrel, tank, tankDefinition, shape.positionData.values.angle);
        sunchip.physicsData.values.sides = shape.physicsData.values.sides;
        sunchip.physicsData.values.size = shape.physicsData.values.size;
        sunchip.positionData.values.x = shape.positionData.values.x;
        sunchip.positionData.values.y = shape.positionData.values.y;
        sunchip.positionData.values.angle = shape.positionData.values.angle;
        const shapeDamagePerTick = shape['damagePerTick'];
        sunchip.damagePerTick *= shapeDamagePerTick / 8;
        sunchip.healthData.values.maxHealth = (sunchip.healthData.values.health *= (shapeDamagePerTick / 8));
        return sunchip;
    }
}
exports.default = NecromancerSquare;
