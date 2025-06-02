import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";

import ShapeManager from "../Entity/Shape/Manager";
import { ArenaFlags } from "../Const/Enums";
import MazeWall from "../Entity/Misc/MazeWall";

/**
 * Manage shape count to zero
 */
export class CompLobbyShapeManager extends ShapeManager {
    protected get wantedShapes() {
        return 0;
    }
}

/**
 * Competitive Lobby Gamemode Arena
 */
export default class CompLobbyArena extends ArenaEntity {

    //limits shape count to zero
    protected shapes: ShapeManager = new CompLobbyShapeManager(this);

    public constructor(game: GameServer) {
        super(game);

        this.updateBounds(4000, 4500);

        const w1 = new MazeWall(this.game, 0, 2020, 1350, 3630);
    }


    public tick(tick: number) {
        const arenaWidth = 3630;
        const arenaHeight = 4600;


        if (this.width !== arenaWidth || this.height !== arenaHeight) this.updateBounds(arenaWidth, arenaHeight);

        super.tick(tick);
    }
}
