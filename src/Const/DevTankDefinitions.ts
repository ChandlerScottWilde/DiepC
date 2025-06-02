/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

import { PI2 } from "../util";
import { TankDefinition } from "./TankDefinitions";

/**
 * The IDs for all the dev tanks, by name.
 */
export const enum DevTank {
    Developer = -1,
    Empty = -2
};

/**
 * List of all dev tank definitions.
*/
const DevTankDefinitions: TankDefinition[] = [
    {
        id: DevTank.Developer,
        name: "Developer",
        upgradeMessage: "Use your right mouse button to teleport to where your mouse is",
        // upgrades dont have any affect
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
        id: DevTank.Empty,
        name: "Empty",
        upgradeMessage: "",
        // upgrades dont have any affect
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
]

export default DevTankDefinitions;
// export const DevTankCount = DevTankDefinitions.reduce((a, b) => b ? a + 1 : a, 1);
