"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = __importDefault(require("../Entity/Shape/Manager"));
const TankBody_1 = __importDefault(require("../Entity/Tank/TankBody"));
const ArenaCloser_1 = __importDefault(require("../Entity/Misc/ArenaCloser"));
const Camera_1 = __importDefault(require("./Camera"));
const FieldGroups_1 = require("./FieldGroups");
const Entity_1 = require("./Entity");
const util_1 = require("../util");
const Guardian_1 = __importDefault(require("../Entity/Boss/Guardian"));
const Summoner_1 = __importDefault(require("../Entity/Boss/Summoner"));
const FallenOverlord_1 = __importDefault(require("../Entity/Boss/FallenOverlord"));
const FallenBooster_1 = __importDefault(require("../Entity/Boss/FallenBooster"));
const Defender_1 = __importDefault(require("../Entity/Boss/Defender"));
const config_1 = require("../config");
class ArenaEntity extends Entity_1.Entity {
    constructor(game) {
        super(game);
        this.arenaData = new FieldGroups_1.ArenaGroup(this);
        this.teamData = new FieldGroups_1.TeamGroup(this);
        this.state = 0;
        this.shapeScoreRewardMultiplier = 1;
        this.allowBoss = true;
        this.boss = null;
        this.leader = null;
        this.shapes = new Manager_1.default(this);
        this.ARENA_PADDING = 200;
        this.updateBounds(this.width = 22300, this.height = 22300);
        this.arenaData.values.topY = -this.height / 2;
        this.arenaData.values.bottomY = this.height / 2;
        this.arenaData.values.leftX = -this.width / 2;
        this.arenaData.values.rightX = this.width / 2;
        this.arenaData.values.flags = 8;
        this.teamData.values.teamColor = 12;
    }
    findSpawnLocation() {
        const pos = {
            x: ~~(2500),
            y: ~~(2500),
        };
        return pos;
    }
    updateScoreboard(scoreboardPlayers) {
        const scoreboardCount = this.arenaData.scoreboardAmount = (this.arenaData.values.flags & 4) ? 0 : Math.min(scoreboardPlayers.length, 10);
        if (!scoreboardCount) {
            if (this.arenaData.values.flags & 2) {
                this.arenaData.flags ^= 2;
            }
            return;
        }
        scoreboardPlayers.sort((p1, p2) => p2.scoreData.values.score - p1.scoreData.values.score);
        this.leader = scoreboardPlayers[0];
        this.arenaData.flags |= 2;
        for (let i = 0; i < scoreboardCount; i = (i + 1)) {
            const player = scoreboardPlayers[i];
            if (player.styleData.values.color === 2)
                this.arenaData.values.scoreboardColors[i] = 13;
            else
                this.arenaData.values.scoreboardColors[i] = player.styleData.values.color;
            this.arenaData.values.scoreboardNames[i] = player.nameData.values.name;
            this.arenaData.values.scoreboardScores[i] = player.scoreData.values.score;
            this.arenaData.values.scoreboardTanks[i] = player['_currentTank'];
        }
    }
    updateArenaState() {
        if ((this.game.tick % config_1.scoreboardUpdateInterval) !== 0)
            return;
        const players = this.getAlivePlayers();
        this.updateScoreboard(players);
        if (players.length === 0 && this.state === 2) {
            this.state = 3;
            setTimeout(() => {
                this.game.end();
            }, 10000);
            return;
        }
    }
    getAlivePlayers() {
        const players = [];
        for (let id = 0; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) &&
                entity instanceof TankBody_1.default &&
                entity.cameraEntity instanceof Camera_1.default &&
                entity.cameraEntity.cameraData.values.player === entity)
                players.push(entity);
        }
        return players;
    }
    updateBounds(arenaWidth, arenaHeight) {
        this.width = arenaWidth;
        this.height = arenaHeight;
        this.arenaData.topY = -arenaHeight / 2;
        this.arenaData.bottomY = arenaHeight / 2;
        this.arenaData.leftX = -arenaWidth / 2;
        this.arenaData.rightX = arenaWidth / 2;
    }
    spawnPlayer(tank, client) {
        const { x, y } = this.findSpawnLocation();
        tank.positionData.values.x = x;
        tank.positionData.values.y = y;
    }
    close() {
        for (const client of this.game.clients) {
            client.notify("Arena closed: No players can join", 0xFF0000, -1);
        }
        this.state = 2;
        this.arenaData.flags |= 1;
        setTimeout(() => {
            const acCount = Math.floor(Math.sqrt(this.width) / 10);
            const radius = this.width * Math.SQRT1_2 + 500;
            for (let i = 0; i < acCount; ++i) {
                const ac = new ArenaCloser_1.default(this.game);
                const angle = (i / acCount) * util_1.PI2;
                ac.positionData.values.x = Math.cos(angle) * radius;
                ac.positionData.values.y = Math.sin(angle) * radius;
                ac.positionData.values.angle = angle + Math.PI;
            }
            (0, util_1.saveToLog)("Arena Closing", "Arena running at `" + this.game.gamemode + "` is now closing.", 0xFFE869);
        }, 5000);
    }
    spawnBoss() {
        const TBoss = [Guardian_1.default, Summoner_1.default, FallenOverlord_1.default, FallenBooster_1.default, Defender_1.default][~~(Math.random() * 5)];
        this.boss = new TBoss(this.game);
    }
    tick(tick) {
        this.shapes.tick();
        this.updateArenaState();
        if (this.leader && this.arenaData.values.flags & 2) {
            this.arenaData.leaderX = this.leader.positionData.values.x;
            this.arenaData.leaderY = this.leader.positionData.values.y;
        }
        if (this.allowBoss && this.game.tick >= 1 && (this.game.tick % config_1.bossSpawningInterval) === 0 && !this.boss) {
            this.spawnBoss();
        }
    }
}
exports.default = ArenaEntity;
