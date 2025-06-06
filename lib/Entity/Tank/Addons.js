"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddonById = exports.GuardObject = exports.Addon = void 0;
const Object_1 = __importDefault(require("../Object"));
const AutoTurret_1 = __importDefault(require("./AutoTurret"));
const AI_1 = require("../AI");
const Live_1 = __importDefault(require("../Live"));
const util_1 = require("../../util");
class Addon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
    createGuard(sides, sizeRatio, offsetAngle, radiansPerTick) {
        return new GuardObject(this.game, this.owner, sides, sizeRatio, offsetAngle, radiansPerTick);
    }
    createAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
}
exports.Addon = Addon;
const AutoTurretMiniDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class GuardObject extends Object_1.default {
    constructor(game, owner, sides, sizeRatio, offsetAngle, radiansPerTick) {
        super(game);
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        this.styleData.values.color = 0;
        this.positionData.values.flags |= 1;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    onKill(killedEntity) {
        if (!(this.owner instanceof Live_1.default))
            return;
        this.owner.onKill(killedEntity);
    }
    tick(tick) {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle += this.radiansPerTick;
    }
}
exports.GuardObject = GuardObject;
class SpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.3, 0, 0.17);
        this.createGuard(3, 1.3, Math.PI / 3, 0.17);
        this.createGuard(3, 1.3, Math.PI / 6, 0.17);
        this.createGuard(3, 1.3, Math.PI / 2, 0.17);
    }
}
class DomBaseAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.24, 0, 0);
    }
}
class SmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
    }
}
class LandmineAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        this.createGuard(6, 1.15, 0, .05);
    }
}
class LauncherAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.flags |= 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
class AutoTurretAddon extends Addon {
    constructor(owner) {
        super(owner);
        new AutoTurret_1.default(owner);
    }
}
class AutoSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        new AutoTurret_1.default(owner);
    }
}
class Auto5Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(5);
    }
}
class Auto3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(3);
    }
}
class PronouncedAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 42 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        pronounce.styleData.values.color = 1;
        pronounce.physicsData.values.flags |= 1;
        pronounce.physicsData.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        };
    }
}
class PronouncedDomAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 22 / 50;
        const widthRatio = 35 / 50;
        const offsetRatio = 50 / 50;
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        pronounce.styleData.values.color = 1;
        pronounce.physicsData.values.flags |= 1;
        pronounce.physicsData.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        };
    }
}
class WeirdSpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.5, 0, 0.17);
        this.createGuard(3, 1.5, 0, -0.16);
    }
}
class Auto2Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(2);
    }
}
class Auto7Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(7);
    }
}
class AutoRocketAddon extends Addon {
    constructor(owner) {
        super(owner);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 40,
            width: 26.25,
            delay: 0,
            reload: 2,
            recoil: 0.75,
            isTrapezoid: true,
            trapezoidDirection: 3.141592653589793,
            addon: null,
            bullet: {
                type: "rocket",
                sizeRatio: 1,
                health: 2.5,
                damage: 0.5,
                speed: 0.3,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        new LauncherAddon(base);
        base.turret.styleData.zIndex += 2;
    }
}
class SpieskAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.3, 0, 0.17);
        this.createGuard(4, 1.3, Math.PI / 6, 0.17);
        this.createGuard(4, 1.3, 2 * Math.PI / 6, 0.17);
    }
}
exports.AddonById = {
    spike: SpikeAddon,
    dombase: DomBaseAddon,
    launcher: LauncherAddon,
    dompronounced: PronouncedDomAddon,
    auto5: Auto5Addon,
    auto3: Auto3Addon,
    autosmasher: AutoSmasherAddon,
    pronounced: PronouncedAddon,
    smasher: SmasherAddon,
    landmine: LandmineAddon,
    autoturret: AutoTurretAddon,
    weirdspike: WeirdSpikeAddon,
    auto7: Auto7Addon,
    auto2: Auto2Addon,
    autorocket: AutoRocketAddon,
    spiesk: SpieskAddon,
};
