"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = __importDefault(require("../Object"));
class MazeWall extends Object_1.default {
    constructor(game, x, y, width, height) {
        super(game);
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= 2 | 256;
        this.physicsData.values.pushFactor = 0;
        this.physicsData.values.absorbtionFactor = 0;
        this.styleData.values.borderWidth = 0;
        this.styleData.values.color = 14;
    }
}
exports.default = MazeWall;
