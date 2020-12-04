class Creature {
    constructor () {
        this.lifeIndex = 100;// 生命值
    }
}

class Dog extends Creature {
    constructor (category, angryIndex) {
        super();
        this.category = category;
        this.attackDamage = 5;// 攻击伤害，消耗对方生命值
        this.angryIndex = angryIndex;
        this.attackExpend = 30;// 消耗 angryIndex
    }

    attack () {
        if (this.angryIndex >= this.attackExpend) {
            this.angryIndex = this.angryIndex - this.attackExpend;
            return this.attackDamage;
        }
        return null;
    }
}

class Man extends Creature {
    constructor (name) {
        super();
        this.name = name;
    }

    hurt (damage) {
        let nextIndex = this.lifeIndex - damage;
        this.lifeIndex = nextIndex < 0 ? 0 : nextIndex;
    }
}

let leo = new Man('Leo');

let teddy = new Dog('Teddy', 100);

let damage = teddy.attack();
if (damage) {
    leo.hurt(damage);
}
