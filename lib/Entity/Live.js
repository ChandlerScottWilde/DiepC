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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("../util"));
const Object_1 = __importDefault(require("./Object"));
const TankBody_1 = __importDefault(require("./Tank/TankBody"));
const TankDefinitions_1 = require("../Const/TankDefinitions");
const FieldGroups_1 = require("../Native/FieldGroups");
const Camera_1 = __importDefault(require("../Native/Camera"));
class LivingEntity extends Object_1.default {
    constructor() {
        super(...arguments);
        this.blockRegen = false;
        this.healthData = new FieldGroups_1.HealthGroup(this);
        this.scoreReward = 0;
        this.regenPerTick = 0;
        this.damagePerTick = 8;
        this.damagedEntities = [];
        this.lastDamageTick = -1;
        this.lastDamageAnimationTick = -1;
        this.damageReduction = 1;
    }
    destroy(animate = true) {
        if (this.hash === 0)
            return;
        if (animate)
            this.healthData.health = 0;
        super.destroy(animate);
    }
    static applyDamage(entity1, entity2) {
        if (entity1.healthData.values.health <= 0 || entity2.healthData.values.health <= 0)
            return;
        if (entity1.damagedEntities.includes(entity2) || entity2.damagedEntities.includes(entity1))
            return;
        if (entity1.damageReduction === 0 || entity2.damageReduction === 0)
            return;
        if (entity1.damagePerTick === 0 && entity1.physicsData.values.pushFactor === 0 || entity2.damagePerTick === 0 && entity2.physicsData.values.pushFactor === 0)
            return;
        const game = entity1.game;
        let dF1 = entity1.damagePerTick * entity2.damageReduction;
        let dF2 = entity2.damagePerTick * entity1.damageReduction;
        if (entity1 instanceof TankBody_1.default && entity2 instanceof TankBody_1.default) {
            dF1 *= 1.5;
            dF2 *= 1.5;
        }
        const ratio = Math.max(1 - entity1.healthData.values.health / dF2, 1 - entity2.healthData.values.health / dF1);
        if (ratio > 0) {
            dF1 *= 1 - ratio;
            dF2 *= 1 - ratio;
        }
        if (entity2.lastDamageAnimationTick !== game.tick && !(entity2.styleData.values.flags & 128)) {
            entity2.styleData.flags ^= 2;
            entity2.lastDamageAnimationTick = game.tick;
        }
        if (dF1 !== 0) {
            if (entity2.lastDamageTick !== game.tick && entity2 instanceof TankBody_1.default && entity2.definition.flags.invisibility && entity2.styleData.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity2.styleData.opacity += TankDefinitions_1.visibilityRateDamage;
            entity2.lastDamageTick = game.tick;
            entity2.healthData.health -= dF1;
        }
        if (entity1.lastDamageAnimationTick !== game.tick && !(entity1.styleData.values.flags & 128)) {
            entity1.styleData.flags ^= 2;
            entity1.lastDamageAnimationTick = game.tick;
        }
        if (dF2 !== 0) {
            if (entity1.lastDamageTick !== game.tick && entity1 instanceof TankBody_1.default && entity1.definition.flags.invisibility && entity1.styleData.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity1.styleData.opacity += TankDefinitions_1.visibilityRateDamage;
            entity1.lastDamageTick = game.tick;
            entity1.healthData.health -= dF2;
        }
        entity1.damagedEntities.push(entity2);
        entity2.damagedEntities.push(entity1);
        if (entity1.healthData.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.healthData.health, entity2.healthData.health, ratio, dF1, dF2);
        }
        if (entity2.healthData.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.healthData.health, entity2.healthData.health, ratio, dF1, dF2);
        }
        if (entity1.healthData.values.health < 0.0001)
            entity1.healthData.health = 0;
        if (entity2.healthData.values.health < 0.0001)
            entity2.healthData.health = 0;
        if (entity1.healthData.values.health === 0) {
            let killer = entity2;
            while (killer.relationsData.values.owner instanceof Object_1.default && killer.relationsData.values.owner.hash !== 0)
                killer = killer.relationsData.values.owner;
            if (killer instanceof LivingEntity)
                entity1.onDeath(killer);
            entity2.onKill(entity1);
        }
        if (entity2.healthData.values.health === 0) {
            let killer = entity1;
            while (killer.relationsData.values.owner instanceof Object_1.default && killer.relationsData.values.owner.hash !== 0)
                killer = killer.relationsData.values.owner;
            if (killer instanceof LivingEntity)
                entity2.onDeath(killer);
            entity1.onKill(entity2);
        }
    }
    static applySetDamage(entity1, entity2, damageRat) {
        if (entity1.healthData.values.health <= 0 || entity2.healthData.values.health <= 0)
            return;
        if (entity1.damagedEntities.includes(entity2) || entity2.damagedEntities.includes(entity1))
            return;
        if (entity1.damageReduction === 0 || entity2.damageReduction === 0)
            return;
        if (entity1.damagePerTick === 0 && entity1.physicsData.values.pushFactor === 0 || entity2.damagePerTick === 0 && entity2.physicsData.values.pushFactor === 0)
            return;
        const game = entity1.game;
        let dF1 = entity1.healthData.values.maxHealth / damageRat;
        let dF2 = entity2.healthData.values.maxHealth / damageRat;
        const ratio = Math.max(1 - entity1.healthData.values.health / dF2, 1 - entity2.healthData.values.health / dF1);
        if (ratio > 0) {
            dF1 *= 1 - ratio;
            dF2 *= 1 - ratio;
        }
        if (entity2.lastDamageAnimationTick !== game.tick && !(entity2.styleData.values.flags & 128)) {
            entity2.styleData.flags ^= 2;
            entity2.lastDamageAnimationTick = game.tick;
        }
        if (dF1 !== 0) {
            if (entity2.lastDamageTick !== game.tick && entity2 instanceof TankBody_1.default && entity2.definition.flags.invisibility && entity2.styleData.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity2.styleData.opacity += TankDefinitions_1.visibilityRateDamage;
            entity2.lastDamageTick = game.tick;
            entity2.healthData.health -= dF1;
        }
        if (entity1.lastDamageAnimationTick !== game.tick && !(entity1.styleData.values.flags & 128)) {
            entity1.styleData.flags ^= 2;
            entity1.lastDamageAnimationTick = game.tick;
        }
        if (dF2 !== 0) {
            if (entity1.lastDamageTick !== game.tick && entity1 instanceof TankBody_1.default && entity1.definition.flags.invisibility && entity1.styleData.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity1.styleData.opacity += TankDefinitions_1.visibilityRateDamage;
            entity1.lastDamageTick = game.tick;
            entity1.healthData.health -= dF2;
        }
        if (entity1.healthData.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.healthData.health, entity2.healthData.health, ratio, dF1, dF2);
        }
        if (entity2.healthData.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.healthData.health, entity2.healthData.health, ratio, dF1, dF2);
        }
        if (entity1.healthData.values.health < 0.0001)
            entity1.healthData.health = 0;
        if (entity2.healthData.values.health < 0.0001)
            entity2.healthData.health = 0;
        if (entity1.healthData.values.health === 0) {
            let killer = entity2;
            while (killer.relationsData.values.owner instanceof Object_1.default && killer.relationsData.values.owner.hash !== 0)
                killer = killer.relationsData.values.owner;
            if (killer instanceof LivingEntity)
                entity1.onDeath(killer);
            if (entity1 instanceof TankBody_1.default && entity2 instanceof TankBody_1.default) {
                if (entity2.cameraEntity instanceof Camera_1.default) {
                    entity2.cameraEntity.client.notify("You've killed " + (entity1.nameData.values.name || "an unnamed tank"));
                }
            }
            entity2.onKill(entity1);
        }
        if (entity2.healthData.values.health === 0) {
            let killer = entity1;
            while (killer.relationsData.values.owner instanceof Object_1.default && killer.relationsData.values.owner.hash !== 0)
                killer = killer.relationsData.values.owner;
            if (killer instanceof LivingEntity)
                entity2.onDeath(killer);
            entity1.onKill(entity2);
            if (entity1 instanceof TankBody_1.default && entity2 instanceof TankBody_1.default) {
                if (entity1.cameraEntity instanceof Camera_1.default) {
                    entity1.cameraEntity.client.notify("You've killed " + (entity2.nameData.values.name || "an unnamed tank"));
                }
            }
            entity1.onKill(entity2);
        }
    }
    onKill(entity) { }
    onDeath(killer) { }
    applyPhysics() {
        super.applyPhysics();
        if (this.healthData.values.health <= 0) {
            this.destroy(true);
            this.damagedEntities = [];
            return;
        }
        if (!this.blockRegen) {
            if (this.healthData.values.health < this.healthData.values.maxHealth) {
                this.healthData.health += this.regenPerTick;
                if (this.game.tick - this.lastDamageTick >= 750) {
                    this.healthData.health += this.healthData.values.maxHealth / 250;
                }
            }
        }
        if (this.healthData.values.health > this.healthData.values.maxHealth) {
            this.healthData.health = this.healthData.values.maxHealth;
        }
        this.damagedEntities = [];
    }
    tick(tick) {
        super.tick(tick);
        const collidedEntities = this.findCollisions();
        for (let i = 0; i < collidedEntities.length; ++i) {
            if (!(collidedEntities[i] instanceof LivingEntity))
                continue;
            if (collidedEntities[i].relationsData.values.team !== this.relationsData.values.team) {
                LivingEntity.applyDamage(collidedEntities[i], this);
            }
        }
    }
}
exports.default = LivingEntity;
