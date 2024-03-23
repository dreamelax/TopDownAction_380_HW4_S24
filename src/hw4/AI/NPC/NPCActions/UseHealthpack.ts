import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Finder from "../../../GameSystems/Searching/Finder";


export default class UseHealthpack extends NPCAction {
    
    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected override _targetFinder: Finder<Battler>;
    // The targets or Targetable entities 
    protected override _targets: Battler[];
    // The target we are going to set the actor to target
    protected override _target: Battler | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) { 
        super(parent, actor);
    }

    public performAction(target: Battler): void {
        if (this._target) {
            // Find the healthpack in the actor's inventory
            const healthpack = this.actor.inventory.find(item => item instanceof Healthpack) as Healthpack | null;

            if (healthpack) {
                // Increment the target's health
                this._target.health = Math.min(this._target.health + healthpack.health, this._target.maxHealth);

                // Remove the healthpack from the actor's inventory
                this.actor.inventory.remove(healthpack.id);

                console.log(`Healthpack used on ${this._target.id}: Health is now ${this._target.health}`);
            }
        }

    }

}