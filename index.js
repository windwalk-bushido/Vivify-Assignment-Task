let game_log_data = "Game beggins...\n\n";

function RandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function SimulateBattle(hero, enemy) {
  function PrintBattleResult(winner, loser) {
    let temp_data = "\n" + winner + " has won the duel against " + loser + "\n\n";
    game_log_data += temp_data;
    console.log(temp_data);
  }

  while (hero.health > 0 || enemy.health > 0) {
    let who_attacks_chooser = RandomNumber(0, 101);
    who_attacks_chooser <= 50 ? hero.attack(enemy) : enemy.attack(hero);
  }

  hero.health <= 0 ? PrintBattleResult(enemy.name, hero.name) : PrintBattleResult(hero.name, enemy.name);
}

class Entity {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  print_attack_result(victim, type_of_attack, damage) {
    let temp_data = "\n" + this.name + " attacked " + victim + " with " + type_of_attack + " -> damage: " + damage;
    game_log_data += temp_data;
    console.log(temp_data);
  }
}

class Hero extends Entity {
  constructor(name, health) {
    super(name, health);

    if (this.name === "Soldier") {
      this.inventory = [];
      this.active_weapon = "sword";

      this.attack = (enemy) => {
        if (this.active_weapon === "sword") {
          enemy.health -= 10;
          this.print_attack_result(enemy.name, this.active_weapon, 10);
        } else if (this.active_weapon === "polearm") {
          enemy.health -= 15;
          this.print_attack_result(enemy.name, this.active_weapon, 15);
        } else {
          enemy.health -= 5;
          this.print_attack_result(enemy.name, this.active_weapon, 5);
        }
      };
    } else {
      this.attack = (enemy) => {
        enemy.health -= 20;
        this.print_attack_result(enemy.name, "spell", 20);
      };
    }
  }

  swap_weapon() {
    if (this.name === "Soldier") {
      if (this.inventory.length === 0) {
        throw "There's no other weapon that " + this.name + " can equip";
      } else {
        this.inventory.push(this.active_weapon);
        this.active_weapon = this.inventory[0];
        this.inventory.unshift(0);
      }
    } else {
      throw "Wizard can't swap weapons because they don't have any";
    }
  }

  pick_up_weapon(weapon) {
    if (this.name === "Soldier") {
      if ((this.active_weapon = "")) {
        this.active_weapon = weapon;
      }
      if (this.inventory.length < 2) {
        this.inventory.push(weapon);

        let temp_data = "\n" + this.name + " put " + weapon + " in his inventory";
        game_log_data += temp_data;
        console.log(temp_data);
      } else {
        throw "Inventory is full";
      }
    } else {
      throw "Wizard can't equip weapons. They use spells to attack";
    }
  }

  drop_weapon(weapon) {
    if (this.name === "Soldier") {
      if (this.inventory[0] === weapon) {
        this.inventory.shift(0);
      } else if (this.inventory[1] === weapon) {
        this.inventory.shift(1);
      } else if (this.active_weapon === weapon) {
        this.active_weapon = "bare hands";
      } else {
        throw this.name + " doesn't have " + weapon + " in the inventory nor in hands";
      }

      let temp_data = "\n" + this.name + " dropped " + weapon + " on the ground";
      game_log_data += temp_data;
      console.log(temp_data);
    } else {
      throw "Wizards can't drop weapon because they don't have any";
    }
  }
}

class Enemy extends Entity {
  constructor(name, health) {
    super(name, health);

    if (this.name === "Dragon") {
      this.spit_fire = (hero) => {
        hero.health -= 20;
        this.print_attack_result(hero.name, "fire spitting", 20);
      };
    } else {
      this.bite = (hero) => {
        hero.health -= 8;
        this.print_attack_result(hero.name, "fang bitting", 8);
      };
    }
  }

  strike(hero) {
    hero.health -= 5;
    this.print_attack_result(hero.name, "normal strike", 5);
  }

  attack(hero) {
    let types_of_attack = ["strike"];
    this.name === "Dragon" ? types_of_attack.push("spit_fire") : types_of_attack.push("bite");
    let choosen_attack_type = RandomNumber(0, 2);
    this[types_of_attack[choosen_attack_type]](hero);
  }
}

const main = () => {
  let Wizard = new Hero("Wizard", 150);

  //Wizard.pick_up_weapon("sword"); // <- Throws error
  //Wizard.drop_weapon("polearm"); // <- Throws error
  //Wizard.swap_weapon(); // <- Throws error

  let swordsman = new Hero("Soldier", 100);
  let pikeman = new Hero("Soldier", 100);

  //swordsman.swap_weapon(); // <- Throws error
  swordsman.drop_weapon("sword");
  //swordsman.drop_weapon("sword"); // <- Throws error
  swordsman.pick_up_weapon("sword");
  swordsman.pick_up_weapon("polearm");
  //swordsman.pick_up_weapon("sword"); // <- Throws error

  swordsman.drop_weapon("polearm");
  pikeman.pick_up_weapon("polearm");
  pikeman.swap_weapon();

  let Dragon = new Enemy("Dragon", 75);
  let Spider_1 = new Enemy("Spider", 50);
  let Spider_2 = new Enemy("Spider", 50);

  SimulateBattle(Wizard, Spider_2);
  SimulateBattle(swordsman, Dragon);
  SimulateBattle(pikeman, Spider_1);

  const fs = require("fs");
  fs.writeFile("game_log.txt", game_log_data, (err) => {
    if (err) throw err;
  });
};

main();
