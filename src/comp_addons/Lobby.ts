import Client from "../Client";
import { CameraFlags, PhysicsFlags, Stat, StyleFlags, Tank } from "../Const/Enums";
import LivingEntity from "../Entity/Live";
import TankBody from "../Entity/Tank/TankBody";
import ClientCamera, { CameraEntity } from "../Native/Camera";
import { Entity } from "../Native/Entity";
import{ getAllGames } from "./GameManager";
import { getRandomMatchup, Matchup, Mtank } from "./matchups";

type Task = () => void; //tasks for delayed function calls

export class Lobby{

    //queues
    queue: Client[] = [];
    matchupQueue: Matchup[] = [];

    //fight stuff
    fighter1!: Client;
    fighter2!: Client;

    tasks: [Task, number][] = [];

    activeFight: boolean = false;
    tickNum: number = -1;

    suddenDeathTicks = 0;

    public constructor(){}

    /// ------------
    /// QUEUE SYSTEM
    /// ------------

    //adding tank to player
    public applyTank(client: Client, tank: Mtank){
        const cam = client.camera;
        cam?.setLevel(tank.level); // setting level
        const player = client.camera?.cameraData.player; // setting tank
        if(player instanceof TankBody){
            player.setTank(Tank[tank.name as keyof typeof Tank]);
        }
        if(cam?.cameraData){
            for(let i = 0; i < tank.stats.length; i++){
                const statID: Stat = tank.stats.length - i - 1;
                cam.cameraData.statLevels[statID] += tank.stats[i];
                cam.cameraData.statsAvailable -= tank.stats[i];
            }
        }
    }

    //returns true if the player is unique (has no extra account tabs open and alive)
    public isUniquePlayerAccount(username: string): boolean{
        const games = getAllGames();
        for(const game of games){
            for(const client of game.clients){
                //if a verified player with the same name exists and is alive, return false
                if(client.verifiedUser === true && client.clientUsername === username && Entity.exists(client.camera?.cameraData.values.player))
                    return false;
            }
        }
        return true;
    }

    public positionAllTanks(){
        let count = 0;
        for(const client of this.queue){
            const x = Math.ceil((count-1)/2) - 1;

            const y = (count) % 2;
            this.tp(x * 600 - 600, y * 300 + 1800, client);

            count++;
        }
    }

    public tp(x: number, y: number, client: Client){
        const player = client.camera?.cameraData.values.player;
        if(player instanceof TankBody){
            player.positionData.x = x;
            player.positionData.y = y;
            player.setVelocity(0, 0);
        }
    }

    public setVelocity(x: number, y: number, client: Client){
        const player = client.camera?.cameraData.player;
        if(player instanceof TankBody){
            player.setVelocity(x, y);
        }
    }

    public stunTank(client: Client){
        client.stun = true
        const player = client.camera?.cameraData.player;
        if(player instanceof TankBody){
            player.physicsData.values.flags |= PhysicsFlags.canEscapeArena; //allowing to move outside the arena
            player.setInvulnerability(true);
            for(const barrel of player.barrels){
                barrel.shootCycle.stun = true;
            }
        }
    }

    public activateTank(client: Client){
        client.stun = false;
        const player = client.camera?.cameraData.player;
        if(player instanceof TankBody){
            player.physicsData.values.flags ^= PhysicsFlags.canEscapeArena; //disallowing to move outside the arena
            player.setInvulnerability(false);
            for(const barrel of player.barrels){
                barrel.shootCycle.stun = false;
                barrel.shootCycle.pos = barrel.shootCycle.reloadTime;
            }
        }
    }

    public enQueue(client: Client){
        this.queue.push(client); //adding client

        if(this.queue.length % 2 === 1){ //Added player is odd
            this.matchupQueue.push(getRandomMatchup()); //we add a new matchup to the queue
            this.applyTank(client, this.matchupQueue[Math.ceil((this.queue.length)/2) - 1].a) //odds get a
        }else{
            this.applyTank(client, this.matchupQueue[Math.ceil((this.queue.length)/2) - 1].b) //evens get b
        }

        this.stunTank(client); //tank will be semi destunned if you switch tanks (you'll be able to shoot again)
        client.setSpectate(true, 0.4);

        //stop player from flashing
        this.setFlashing(client, false);

        //consider starting fight
        this.fightChance();
    }

    public deQueue(): Client{ //either returns the client or undefined if the list is empty
        return this.queue.shift()!;
    }

    //returns the index of the client with the username presented
    public indexOf(client: Client): number{
        return this.queue.indexOf(client);
    }

    public get length(): number{
        return this.queue.length;
    }

    public removeClient(client: Client): boolean {
        const index = this.queue.indexOf(client);

        if (index !== -1) { 
            this.queue.splice(index, 1);

            //adjusting tanks
            for(let i = index; i < this.queue.length; i++){
                if(i % 2 === 1){
                this.applyTank(this.queue[i], this.matchupQueue[Math.ceil((this.queue.length)/2) - 1].a);
                this.stunTank(this.queue[i]);
                client.setSpectate(true, 0.4);
                }
            }

            return true; // successfully removed
        }
        return false; // client not found
    }

    public setFlashing(client: Client, tf: boolean){
        const player = client.camera?.cameraData.player;
        if(tf){
            if(player instanceof TankBody) player.styleData.flags |= StyleFlags.isFlashing;
        }else{
            if(player instanceof TankBody) player.styleData.flags ^= StyleFlags.isFlashing;
        }
    }

    /// ------------
    /// FIGHT SYSTEM
    /// ------------

    public fightChance(){
        if(this.queue.length >= 2 && this.activeFight === false){
            this.beginFight();
            this.activeFight = true;
        }
    }

    public beginFight(){
        this.fighter1 = this.deQueue();
        this.fighter2 = this.deQueue();
        this.matchupQueue.shift;

        console.log("mQueue")
        for(let i = 0; i < this.matchupQueue.length; i++)
            console.log(this.matchupQueue[i].a.name)
        
        this.fighter1.setSpectate(false);
        this.fighter2.setSpectate(false);

        const [pointA, pointB] = this.getRandomOppositePoints(200);
        this.tp(pointA[0], pointA[1] - 450, this.fighter1);
        this.tp(pointB[0], pointB[1] - 450, this.fighter2);

        this.positionAllTanks(); //fixing other tanks positions

        //activate flashing
        this.setFlashing(this.fighter1, true);
        this.setFlashing(this.fighter2, true);

        //setting fight tasks

        //pre fight messages
        this.notifyAll(this.fighter1.clientUsername + " vs " + this.fighter2.clientUsername, 0x000000, 3000); //TODO:: change colors for each message
        this.addTask(() => this.notifyAll("3", 0x000000, 1000), 75); 
        this.addTask(() => this.notifyAll("2", 0x000000, 1000), 100);
        this.addTask(() => this.notifyAll("1", 0x000000, 1000), 125);
        this.addTask(() => this.notifyAll("Fight!", 0x000000, 3000), 150);

        //shoot players apart
        this.addTask(() => this.setVelocity(this.getAngleRadians(pointA[0], pointA[1]), 150, this.fighter1), 150);
        this.addTask(() => this.setVelocity(this.getAngleRadians(pointB[0], pointB[1]), 150, this.fighter2), 150);
        //stop flashing
        this.addTask(() => this.setFlashing(this.fighter1, false), 150);
        this.addTask(() => this.setFlashing(this.fighter2, false), 150);
        //activate players
        this.addTask(() => this.activateTank(this.fighter1), 150);
        this.addTask(() => this.activateTank(this.fighter2), 150);

        //1 minute remaining
        this.addTask(() => this.notifyAll("One Minute Remaining", 0x000000, 3000), 1150); 
        this.addTask(() => this.notifyAll("Regen Disabled", 0x000000, 3000), 1225); 
        //blockingRegen
        this.addTask(() => this.setRegen(this.fighter1, false), 1225); 
        this.addTask(() => this.setRegen(this.fighter2, false), 1225); 
        
        // 10 seconds until sudden death
        this.addTask(() => this.notifyAll("10 seconds until sudden death", 0x000000, 3000), 2400); 

        // sudden death
        this.addTask(() => this.notifyAll("Entering: Sudden Death", 0x000000, 3000), 2650); 
        this.addTask(() => this.suddenDeathTicks = 10, 2650); 

    }

    public fighterDead(){
        this.clearTasks();

        //waiting 3 seconds
        this.addTask(() => this.evaluateMatch(), 75); 
    }

    private evaluateMatch(){
        const player1 = this.fighter1.camera?.cameraData.values.player;
        const player2 = this.fighter2.camera?.cameraData.values.player;

        const f1Alive = Entity.exists(player1) && player1 instanceof TankBody;
        const f2Alive = Entity.exists(player2) && player2 instanceof TankBody;

        if(f1Alive && !f2Alive){ //f1 wins
            this.setFlashing(this.fighter1, true);
            this.winnerLoser(this.fighter1, this.fighter2);
        }else if(!f1Alive && f2Alive){ // f2 wins
            this.setFlashing(this.fighter2, true);
            this.winnerLoser(this.fighter2, this.fighter1);
        }else if(!f1Alive && !f2Alive){ // tie
            this.tie();
        }else{
            throw "what the fuck";
        }
    }

    private winnerLoser(winner: Client, loser: Client){
        //setting winner invulnerable
        const player = winner.camera?.cameraData.player;
        if(player instanceof TankBody) player.setInvulnerability(true);
        const cam = winner.camera;
        cam?.setLevel(100); // setting level        

        this.notifyAll(winner.clientUsername + " Wins!", 0x000000, 5000);

        //eloDifference = calculateElo(winner, loser);
        //this.notifyAll("     " + loser.clientUsername + " " + eloDifference, 0x000000, 5000); //red
        //this.notifyAll("     " + winner.clientUsername + " " + eloDifference, 0x000000, 5000); //green

        //TODO:: adjust elos accordingly

        this.addTask(() => this.killClient(winner), 125); //kill
        this.addTask(() => this.activeFight = false, 150); //reset var
        this.addTask(() => this.fightChance(), 150); //activate another fight if possible
    }

    private tie(){
        this.notifyAll("Tie!", 0x000000, 5000);

        //eloDifferences = calculateEloTie(player1, player2);
        //this.notifyAll("     " + loser.clientUsername + " " + eloDifferences[0] , 0x000000, 5000); //red
        //this.notifyAll("     " + winner.clientUsername + " " + eloDifferences[1], 0x000000, 5000); //green
        //TODO:: adjust elos accordingly

        this.addTask(() => this.activeFight = false, 150); //reset var
        this.addTask(() => this.fightChance(), 150); //activate another fight if possible
    } 


    
    public killClient(client: Client){
        const player = client.camera?.cameraData.player;
        const camera = client.camera;
        if(player instanceof TankBody && camera instanceof CameraEntity){
            camera.cameraData.killedBy = player.nameData.values.name;
            player.destroy();
        }
    }

    public suddenDeathTick(client1: Client, client2: Client){
        const player1 = client1.camera?.cameraData.player;
        const player2 = client2.camera?.cameraData.player;
        if(player1 instanceof TankBody && player2 instanceof TankBody){
            LivingEntity.applySetDamage(player1, player2, 10);
        }
    }

    public setRegen(client: Client, tf: boolean){
        const player = client.camera?.cameraData.values.player;
        if(player instanceof TankBody){
            if(tf){
                player.blockRegen = false;
            } else player.blockRegen = true;
        }   
    }

    public clearTasks(){
        this.tasks = [];
    }

    public addTask(task: Task, delay: number){
        this.tasks.push([task, this.tickNum + delay]);
    }

    private runTasks(){ //runs tasks that are active this tick
        let sliceIndices = []; //to remove all the tasks we hit after we finish doing the tasks
        for(let i = 0; i < this.tasks.length; i++){
            if(this.tasks[i][1] === this.tickNum){
                if(this.tasks[i][0]){
                    this.tasks[i][0]();
                    sliceIndices.push(i);
                }
            }
        }
        //removing tasks
        for(let i = sliceIndices.length - 1; i >= 0; i--){
            this.tasks.splice(i, 1);
        }
    }

    //helpermethod for begin fight
    private getRandomOppositePoints(radius: number): [number, number][] {
        // Random angle in radians
        const angle = Math.random() * 2 * Math.PI;

        // First point on the circle
        const x1 = radius * Math.cos(angle);
        const y1 = radius * Math.sin(angle);

        // Opposite point (180 degrees or π radians apart)
        const x2 = -x1;
        const y2 = -y1;

        return [
            [x1, y1],
            [x2, y2],
        ];
    }

    //helper method for converting coordinates to angles
    private getAngleRadians(x: number, y: number): number {
        return Math.atan2(y, x);
    }

    public notifyAll(text: string, color: number, duration: number){
        for(const client of this.queue){
            client.notify(text, color, duration)
        }
        if(this.fighter1 instanceof Client) this.fighter1.notify(text, color, duration);
        if(this.fighter2 instanceof Client) this.fighter2.notify(text, color, duration);
    }

    public tick(tick: number){
        this.tickNum = tick;
        this.runTasks();

        //sudden death ticks
        if(this.suddenDeathTicks > 0 && tick % 50 === 0){
            if(this.fighter1 instanceof Client && this.fighter2 instanceof Client){
                this.suddenDeathTick(this.fighter1, this.fighter2);
                this.suddenDeathTicks--;
            }else{//if a player dies stop
                this.suddenDeathTicks = 0;
            }
        }
    }

}