"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const Client_1 = __importDefault(require("../Client"));
const Enums_1 = require("../Const/Enums");
const Live_1 = __importDefault(require("../Entity/Live"));
const TankBody_1 = __importDefault(require("../Entity/Tank/TankBody"));
const Camera_1 = require("../Native/Camera");
const Entity_1 = require("../Native/Entity");
const GameManager_1 = require("./GameManager");
const matchups_1 = require("./matchups");
class Lobby {
    constructor() {
        this.queue = [];
        this.matchupQueue = [];
        this.tasks = [];
        this.activeFight = false;
        this.tickNum = -1;
        this.suddenDeathTicks = 0;
    }
    applyTank(client, tank) {
        const cam = client.camera;
        cam?.setLevel(tank.level);
        const player = client.camera?.cameraData.player;
        if (player instanceof TankBody_1.default) {
            player.setTank(Enums_1.Tank[tank.name]);
        }
        if (cam?.cameraData) {
            for (let i = 0; i < tank.stats.length; i++) {
                const statID = tank.stats.length - i - 1;
                cam.cameraData.statLevels[statID] += tank.stats[i];
                cam.cameraData.statsAvailable -= tank.stats[i];
            }
        }
    }
    isUniquePlayerAccount(username) {
        const games = (0, GameManager_1.getAllGames)();
        for (const game of games) {
            for (const client of game.clients) {
                if (client.verifiedUser === true && client.clientUsername === username && Entity_1.Entity.exists(client.camera?.cameraData.values.player))
                    return false;
            }
        }
        return true;
    }
    positionAllTanks() {
        let count = 0;
        for (const client of this.queue) {
            const x = Math.ceil((count - 1) / 2) - 1;
            const y = (count) % 2;
            this.tp(x * 600 - 600, y * 300 + 1800, client);
            count++;
        }
    }
    tp(x, y, client) {
        const player = client.camera?.cameraData.values.player;
        if (player instanceof TankBody_1.default) {
            player.positionData.x = x;
            player.positionData.y = y;
            player.setVelocity(0, 0);
        }
    }
    setVelocity(x, y, client) {
        const player = client.camera?.cameraData.player;
        if (player instanceof TankBody_1.default) {
            player.setVelocity(x, y);
        }
    }
    stunTank(client) {
        client.stun = true;
        const player = client.camera?.cameraData.player;
        if (player instanceof TankBody_1.default) {
            player.physicsData.values.flags |= 256;
            player.setInvulnerability(true);
            for (const barrel of player.barrels) {
                barrel.shootCycle.stun = true;
            }
        }
    }
    activateTank(client) {
        client.stun = false;
        const player = client.camera?.cameraData.player;
        if (player instanceof TankBody_1.default) {
            player.physicsData.values.flags ^= 256;
            player.setInvulnerability(false);
            for (const barrel of player.barrels) {
                barrel.shootCycle.stun = false;
                barrel.shootCycle.pos = barrel.shootCycle.reloadTime;
            }
        }
    }
    enQueue(client) {
        this.queue.push(client);
        if (this.queue.length % 2 === 1) {
            this.matchupQueue.push((0, matchups_1.getRandomMatchup)());
            this.applyTank(client, this.matchupQueue[Math.ceil((this.queue.length) / 2) - 1].a);
        }
        else {
            this.applyTank(client, this.matchupQueue[Math.ceil((this.queue.length) / 2) - 1].b);
        }
        this.stunTank(client);
        client.setSpectate(true, 0.4);
        this.setFlashing(client, false);
        this.fightChance();
    }
    deQueue() {
        return this.queue.shift();
    }
    indexOf(client) {
        return this.queue.indexOf(client);
    }
    get length() {
        return this.queue.length;
    }
    removeClient(client) {
        const index = this.queue.indexOf(client);
        if (index !== -1) {
            this.queue.splice(index, 1);
            for (let i = index; i < this.queue.length; i++) {
                if (i % 2 === 1) {
                    this.applyTank(this.queue[i], this.matchupQueue[Math.ceil((this.queue.length) / 2) - 1].a);
                    this.stunTank(this.queue[i]);
                    client.setSpectate(true, 0.4);
                }
            }
            return true;
        }
        return false;
    }
    setFlashing(client, tf) {
        const player = client.camera?.cameraData.player;
        if (tf) {
            if (player instanceof TankBody_1.default)
                player.styleData.flags |= 4;
        }
        else {
            if (player instanceof TankBody_1.default)
                player.styleData.flags ^= 4;
        }
    }
    fightChance() {
        if (this.queue.length >= 2 && this.activeFight === false) {
            this.beginFight();
            this.activeFight = true;
        }
    }
    beginFight() {
        this.fighter1 = this.deQueue();
        this.fighter2 = this.deQueue();
        this.matchupQueue.shift;
        console.log("mQueue");
        for (let i = 0; i < this.matchupQueue.length; i++)
            console.log(this.matchupQueue[i].a.name);
        this.fighter1.setSpectate(false);
        this.fighter2.setSpectate(false);
        const [pointA, pointB] = this.getRandomOppositePoints(200);
        this.tp(pointA[0], pointA[1] - 450, this.fighter1);
        this.tp(pointB[0], pointB[1] - 450, this.fighter2);
        this.positionAllTanks();
        this.setFlashing(this.fighter1, true);
        this.setFlashing(this.fighter2, true);
        this.notifyAll(this.fighter1.clientUsername + " vs " + this.fighter2.clientUsername, 0x000000, 3000);
        this.addTask(() => this.notifyAll("3", 0x000000, 1000), 75);
        this.addTask(() => this.notifyAll("2", 0x000000, 1000), 100);
        this.addTask(() => this.notifyAll("1", 0x000000, 1000), 125);
        this.addTask(() => this.notifyAll("Fight!", 0x000000, 3000), 150);
        this.addTask(() => this.setVelocity(this.getAngleRadians(pointA[0], pointA[1]), 150, this.fighter1), 150);
        this.addTask(() => this.setVelocity(this.getAngleRadians(pointB[0], pointB[1]), 150, this.fighter2), 150);
        this.addTask(() => this.setFlashing(this.fighter1, false), 150);
        this.addTask(() => this.setFlashing(this.fighter2, false), 150);
        this.addTask(() => this.activateTank(this.fighter1), 150);
        this.addTask(() => this.activateTank(this.fighter2), 150);
        this.addTask(() => this.notifyAll("One Minute Remaining", 0x000000, 3000), 1150);
        this.addTask(() => this.notifyAll("Regen Disabled", 0x000000, 3000), 1225);
        this.addTask(() => this.setRegen(this.fighter1, false), 1225);
        this.addTask(() => this.setRegen(this.fighter2, false), 1225);
        this.addTask(() => this.notifyAll("10 seconds until sudden death", 0x000000, 3000), 2400);
        this.addTask(() => this.notifyAll("Entering: Sudden Death", 0x000000, 3000), 2650);
        this.addTask(() => this.suddenDeathTicks = 10, 2650);
    }
    fighterDead() {
        this.clearTasks();
        this.addTask(() => this.evaluateMatch(), 75);
    }
    evaluateMatch() {
        const player1 = this.fighter1.camera?.cameraData.values.player;
        const player2 = this.fighter2.camera?.cameraData.values.player;
        const f1Alive = Entity_1.Entity.exists(player1) && player1 instanceof TankBody_1.default;
        const f2Alive = Entity_1.Entity.exists(player2) && player2 instanceof TankBody_1.default;
        if (f1Alive && !f2Alive) {
            this.setFlashing(this.fighter1, true);
            this.winnerLoser(this.fighter1, this.fighter2);
        }
        else if (!f1Alive && f2Alive) {
            this.setFlashing(this.fighter2, true);
            this.winnerLoser(this.fighter2, this.fighter1);
        }
        else if (!f1Alive && !f2Alive) {
        }
        else {
            throw "what the fuck";
        }
    }
    winnerLoser(winner, loser) {
        const player = winner.camera?.cameraData.player;
        if (player instanceof TankBody_1.default)
            player.setInvulnerability(true);
        const cam = winner.camera;
        cam?.setLevel(100);
        this.notifyAll(winner.clientUsername + " Wins!", 0x000000, 5000);
        this.addTask(() => this.killClient(winner), 125);
        this.addTask(() => this.activeFight = false, 150);
        this.addTask(() => this.fightChance(), 150);
    }
    tie() {
        this.notifyAll("Tie!", 0x000000, 5000);
        this.addTask(() => this.activeFight = false, 150);
        this.addTask(() => this.fightChance(), 150);
    }
    killClient(client) {
        const player = client.camera?.cameraData.player;
        const camera = client.camera;
        if (player instanceof TankBody_1.default && camera instanceof Camera_1.CameraEntity) {
            camera.cameraData.killedBy = player.nameData.values.name;
            player.destroy();
        }
    }
    suddenDeathTick(client1, client2) {
        const player1 = client1.camera?.cameraData.player;
        const player2 = client2.camera?.cameraData.player;
        if (player1 instanceof TankBody_1.default && player2 instanceof TankBody_1.default) {
            Live_1.default.applySetDamage(player1, player2, 10);
        }
    }
    setRegen(client, tf) {
        const player = client.camera?.cameraData.values.player;
        if (player instanceof TankBody_1.default) {
            if (tf) {
                player.blockRegen = false;
            }
            else
                player.blockRegen = true;
        }
    }
    clearTasks() {
        this.tasks = [];
    }
    addTask(task, delay) {
        this.tasks.push([task, this.tickNum + delay]);
    }
    runTasks() {
        let sliceIndices = [];
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i][1] === this.tickNum) {
                if (this.tasks[i][0]) {
                    this.tasks[i][0]();
                    sliceIndices.push(i);
                }
            }
        }
        for (let i = sliceIndices.length - 1; i >= 0; i--) {
            this.tasks.splice(i, 1);
        }
    }
    getRandomOppositePoints(radius) {
        const angle = Math.random() * 2 * Math.PI;
        const x1 = radius * Math.cos(angle);
        const y1 = radius * Math.sin(angle);
        const x2 = -x1;
        const y2 = -y1;
        return [
            [x1, y1],
            [x2, y2],
        ];
    }
    getAngleRadians(x, y) {
        return Math.atan2(y, x);
    }
    notifyAll(text, color, duration) {
        for (const client of this.queue) {
            client.notify(text, color, duration);
        }
        if (this.fighter1 instanceof Client_1.default)
            this.fighter1.notify(text, color, duration);
        if (this.fighter2 instanceof Client_1.default)
            this.fighter2.notify(text, color, duration);
    }
    tick(tick) {
        this.tickNum = tick;
        this.runTasks();
        if (this.suddenDeathTicks > 0 && tick % 50 === 0) {
            if (this.fighter1 instanceof Client_1.default && this.fighter2 instanceof Client_1.default) {
                this.suddenDeathTick(this.fighter1, this.fighter2);
                this.suddenDeathTicks--;
            }
            else {
                this.suddenDeathTicks = 0;
            }
        }
    }
}
exports.Lobby = Lobby;
