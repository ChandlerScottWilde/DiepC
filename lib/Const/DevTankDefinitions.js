"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const DevTankDefinitions = [
    {
        id: -1,
        name: "Developer",
        upgradeMessage: "Use your right mouse button to teleport to where your mouse is",
        upgrades: [],
        barrels: [
            {
                angle: 0,
                delay: 0,
                size: 85,
                offset: 0,
                recoil: 2,
                addon: null,
                bullet: {
                    type: "bullet",
                    speed: .5,
                    damage: .5,
                    health: 0.45,
                    scatterRate: 0.01,
                    lifeLength: 0.3,
                    absorbtionFactor: 1,
                    sizeRatio: 1
                },
                reload: .6,
                width: 50,
                isTrapezoid: true,
                trapezoidDirection: Math.PI
            }
        ],
        levelRequirement: 45,
        fieldFactor: .75,
        speed: 1.5,
        absorbtionFactor: 1,
        flags: {
            invisibility: false,
            zoomAbility: false,
            devOnly: false
        },
        visibilityRateShooting: 0.23,
        visibilityRateMoving: 0,
        invisibilityRate: 0,
        preAddon: "spike",
        postAddon: null,
        maxHealth: 50,
        borderWidth: 15,
        sides: 1,
        stats: [
            {
                name: "Movement Speed",
                max: 9
            },
            {
                name: "Reload",
                max: 9
            },
            {
                name: "Bullet Damage",
                max: 9
            },
            {
                name: "Bullet Penetration",
                max: 9
            },
            {
                name: "Bullet Speed",
                max: 9
            },
            {
                name: "Body Damage",
                max: 9
            },
            {
                name: "Max Health",
                max: 9
            },
            {
                name: "Health Regen",
                max: 9
            }
        ]
    },
    {
        id: -2,
        name: "Empty",
        upgradeMessage: "",
        upgrades: [],
        barrels: [],
        levelRequirement: 45,
        fieldFactor: Infinity,
        speed: 0,
        absorbtionFactor: 1,
        flags: {
            invisibility: false,
            zoomAbility: false,
            devOnly: false
        },
        visibilityRateShooting: 0,
        visibilityRateMoving: 0,
        invisibilityRate: 0,
        preAddon: null,
        postAddon: null,
        maxHealth: 1,
        borderWidth: 0,
        sides: 0,
        stats: [
            {
                name: "Movement Speed",
                max: 9
            },
            {
                name: "Reload",
                max: 9
            },
            {
                name: "Bullet Damage",
                max: 9
            },
            {
                name: "Bullet Penetration",
                max: 9
            },
            {
                name: "Bullet Speed",
                max: 9
            },
            {
                name: "Body Damage",
                max: 9
            },
            {
                name: "Max Health",
                max: 9
            },
            {
                name: "Health Regen",
                max: 9
            }
        ]
    }
];
exports.default = DevTankDefinitions;
