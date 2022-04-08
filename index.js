function RandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function SimulateBattle(hero, enemy) {
  function PrintBattleResult(winner, loser) {
    console.log(winner + " has won the duel against " + loser);
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
    console.log(this.name + " attacked " + victim + " with " + type_of_attack + " - damage: " + damage);
  }
}

class Hero extends Entity {
  constructor(name, health) {
    super(name, health);

    if (this.name === "Soldier") {
      this.inventory = [];
      this.active_weapon = "";
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
        if (this.active_weapon !== "bare hands") {
          this.inventory.push(this.active_weapon);
        }
        this.active_weapon = this.inventory[0];
        this.inventory.unshift(0);
      }
    } else {
      throw "Wizard can't swap weapons because they don't have any";
    }
  }

  pick_weapon(weapon) {
    if (this.name === "Soldier") {
      if (this.inventory.length < 2) {
        this.inventory.push(weapon);
        console.log(this.name + " put " + weapon + " in his inventory");
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
        this.inventory.unshift(0);
      } else {
        this.inventory.unshift(1);
      }
      if (this.inventory.length != 0) {
        this.active_weapon = this.inventory[0];
      } else {
        this.active_weapon = "bare hands";
      }
      console.log(this.name + " dropped " + weapon + " on the ground");
    } else {
      throw "Wizards can't drop weapon because they don't have any";
    }
  }
}

class Enemy extends Entity {
  constructor(name, health) {
    super(name, health);
  }

  strike(hero) {
    hero.health -= 5;
    this.print_attack_result(hero.name, " normal strike", 5);
  }

  attack(hero) {
    let types_of_attack = ["strike"];
    if (this.name === "Dragon") {
      types_of_attack.push("spit_fire");
    } else {
      types_of_attack.push("bite");
    }
    let choosen_attack_type = RandomNumber(0, types_of_attack.length);
    this[types_of_attack[choosen_attack_type]](hero);
  }
}

function GiveDragonFire(dragon) {
  dragon.spit_fire = (hero) => {
    hero.health -= 20;
    dragon.print_attack_result(hero.name, " fire spitting", 20);
  };
}

function GiveSpiderFangs(spider) {
  spider.bite = (hero) => {
    hero.health -= 8;
    spider.print_attack_result(hero.name, " fang bitting", 8);
  };
}

const main = () => {
  let Wizard = new Hero("Wizard", 150);

  //Wizard.pick_weapon("sword"); <- Throws error
  //Wizard.drop_weapon("polearm"); <- Throws error
  //Wizard.swap_weapon; <- Throws error

  let Swordsman_1 = new Hero("Soldier", 100);

  let Swordsman_2 = new Hero("Soldier", 100);

  Swordsman_1.pick_weapon("sword");
  Swordsman_1.pick_weapon("polearm");
  //Swordsman_1.pick_weapon("sword"); <- Throws error

  Swordsman_1.drop_weapon("polearm");
  Swordsman_2.swap_weapon;
  Swordsman_2.pick_weapon("polearm");

  let Dragon = new Enemy("Dragon", 75);
  GiveDragonFire(Dragon);

  let Spider_1 = new Enemy("Spider", 50);
  GiveSpiderFangs(Spider_1);

  let Spider_2 = new Enemy("Spider", 50);
  GiveSpiderFangs(Spider_2);

  SimulateBattle(Wizard, Spider_1);
  SimulateBattle(Swordsman_1, Dragon);
  SimulateBattle(Swordsman_2, Spider_1);
};

main();
