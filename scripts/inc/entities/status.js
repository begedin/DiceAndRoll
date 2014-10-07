define([
    'Phaser',
], function (Phaser) {

    var Status = function (game, character) {
        this.game = game;
        this.character = character;

        this.character.customEvents.onActed.add(this.processTurn, this);

        this.canAct = true;
        this.totalAttackMod = 0;
        this.totalDefenseMod = 0;

        Phaser.Group.call(this, this.game, this.character, character.name + '_status');
    }

    Status.prototype = Object.create(Phaser.Group.prototype);
    Status.prototype.constructor = Status;

    // type is any of the following: ATTACK, DEFENSE, STUN, POISON
    // duration is expressed in turns, default is 1
    // power is the strenght of the effect. not applicable for STUN
    Status.prototype.addEffect = function (type, duration, power) {

        var effect;
        switch (type) {
            case 'ATTACK': effect = this.create(0, 0, 'cards/emblem-sword');
                break;
            case 'DEFENSE': effect = this.create(0, 0, 'cards/emblem-shield');
                break;
            case 'STUN': effect = this.create(0, 0, 'cards/emblem-mace');
                break;
            case 'POISON': effect = this.create(0, 0, 'cards/emblem-potion');
                break;
        }
        effect.duration = duration;
        effect.power = power;
        effect.type = type;
        if ((power > 0 && effect.type === 'POISON') || (power < 0 && effect.type !== 'POISON') || (effect.type === 'STUN')) effect.tint = 0xff3333;
        else effect.tint = 0x33ff33;
        effect.scale.setTo(0.5);
        effect.anchor.setTo(0.5);
    }

    // removes all effects of a certain type
    // intended for use with status healing abilities.
    Status.prototype.removeEffectsOfType = function (type) {
        this.forEach(function (effect) {
            if (effect.type === type) this.remove(effect);
        }, this);
    }

    Status.prototype.processTurn = function () {
        var totalAttackMod = 0,
            totalDefenseMod = 0,
            totalDamage = 0;
            expiredEffects = [];

        this.forEach(function (statusEffect) {
            statusEffect.duration--;
            switch (statusEffect.type) {
                case 'ATTACK': totalAttackMod += statusEffect.power;
                    break;
                case 'DEFENSE': totalDefenseMod += statusEffect.power;
                    break;
                case 'POISON': totalDamage += statusEffect.power * this.game.rnd.integerInRange(1, 6);
                    break;
            }

            if (statusEffect.duration <= 0) expiredEffects.push(statusEffect);
        }, this);

        if (totalDamage > 0) this.character.damage(totalDamage);

        for (var i in expiredEffects) {
            this.remove(expiredEffects[i], true);
        }

        this.totalAttackMod = totalAttackMod;
        this.totalDefenseMod = totalDefenseMod;
    };

    Status.prototype.update = function () {
        this.forEach(function (effect) {
            var index = this.getIndex(effect);
            effect.position.setTo(index * 50, 0);
            var alpha = effect.duration * 0.1 + 0.5;
            if (alpha > 1) alpha = 1;
            effect.alpha = alpha;
        }, this);
    }

    Status.prototype.hasBlockingEffect = function () {
        var hasStun = false;
        this.forEach(function (statusEffect) {
            if (statusEffect.type === 'STUN') { hasStun = true; }
        }, this);

        return hasStun;
    }

    return Status;
});