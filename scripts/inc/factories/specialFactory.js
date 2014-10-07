define(['inc/entities/special'], function (Special) {

    var assembleSpecial = function (game, character, key, customTexture) {

        var special = (key === 'melee_attack' || key === 'ranged_attack') ?
            new Special(game, character, customTexture, true) :
            new Special(game, character, 'specials/' + key);

        var data = game.assets.specials[key];
        special.setData(data);
        special.getTargets = targeting[data.targetType];
        special.execute = execution[data.executionType] || executeCallbacks[key];

        return special;
    };

    var executeCallbacks = {};

    var targeting = {};

    targeting.self = function () {
        return [this.character];
    };

    targeting.anyEnemy = function () {
        var combatants = this.character.parent,
            targets = [];

        combatants.forEach(function (combatant) {
            if (combatant.team !== this.character.team) {
                targets.push(combatant);
            }
        }, this);

        return targets;
    }

    targeting.anyEnemyInNearestRank = function () {
        var combatants = this.character.parent,
            targets = [];

        combatants.forEach(function (combatant) {
            if (combatant.team !== this.character.team) {
                if (combatant.type === 'MELEE') targets.push(combatant);
            }
        }, this);

        if (targets.length === 0) {
            combatants.forEach(function (combatant) {
                if (combatant.team !== this.character.team) {
                    targets.push(combatant);
                }
            }, this);
        }

        return targets;
    }

    targeting.anyFriend = function () {
        var combatants = this.character.parent,
            targets = [];

        combatants.forEach(function (combatant) {
            if (combatant.team === this.character.team) {
                targets.push(combatant);
            }
        }, this);

        return targets;
    };

    targeting.notImplemented = function () {
        console.log('targeting feature not implemented');
        return [];
    };

    var execution = {}

    execution.attackSingleTarget = function (target, attackCount, modifier) {
        var actor = this,
            combatants = this.character.parent,
            tweens = [],
            index = 0;

        for (var i = 0; i < attackCount; i++) {

            var tween = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 800, Phaser.Easing.Bounce.Out, false);

            tween.onComplete.addOnce(function () {
                this.game.sound.play('sword', this.game.utils.settings.sound.sfxVolume);
                var attack = this.character.getEffectiveAttack(modifier), defense = target.getEffectiveDefense(),
                    damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
                if (damage < 0) damage = 0;
                target.damage(damage);
            }, this);

            tweens.push(tween);

            if (index > 0) tweens[index - 1].chain(tween);
            index++;
        }

        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);
        tweens[0].start();
        tweens[tweens.length - 1].chain(tweenBack);

        return tweenBack;
    };

    execution.attackRankAtOnce = function (target, modifier) {
        var actor = this;

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.chain(tweenBack);

        var damageList = [];

        tweenTo.onComplete.addOnce(function () {
            this.game.sound.play('sword', this.game.utils.settings.sound.sfxVolume);
            this.character.parent.forEach(function (combatant) {
                if (combatant.team !== this.character.team && combatant.type === target.type) {
                    var attack = this.character.getEffectiveAttack(modifier), defense = combatant.getEffectiveDefense(),
                        damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
                    if (damage < 0) damage = 0;

                    // there's a chance we killed a combatant while iterating, so we can't deal the damage until iteration is over.
                    damageList.push({ combatant: combatant, damage: damage });
                }
            }, this);

            for (var i in damageList) {
                damageList[i].combatant.damage(damageList[i].damage);
            };

        }, this);

        return tweenBack;
    };

    execution.attackRankInSequence = function (target, modifier) {
        var actor = this,
            combatants = this.character.parent,
            tweens = [],
            index = 1;

        var performAttack = function (target) {
            this.game.sound.play('sword', this.game.utils.settings.sound.sfxVolume);
            var attack = this.character.getEffectiveAttack(modifier), defense = target.getEffectiveDefense(),
                damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
            if (damage < 0) damage = 0;
            target.damage(damage);
        }

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, false);
        tweenTo.onComplete.addOnce(performAttack.bind(this, target), this);

        tweens.push(tweenTo);

        combatants.forEach(function (combatant) {
            if (combatant.team !== this.character.team && combatant.type === this.character.type && combatant !== target) {
                var tween = this.game.add.tween(actor).to({ x: combatant.x, y: combatant.y }, 800, Phaser.Easing.Bounce.Out, false);

                tween.onComplete.addOnce(performAttack.bind(this, combatant), this);

                tweens.push(tween);

                tweens[index - 1].chain(tween);
                index++;
            }
        }, this);

        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);
        tweens[0].start();
        tweens[tweens.length - 1].chain(tweenBack);

        return tweenBack;
    };

    execution.attackRandomInSequence = function (target, attackCount, modifier) {
        var actor = this,
            combatants = this.character.parent,
            tweens = [],
            index = 1;

        var performAttack = function (target) {
            this.game.sound.play('sword', this.game.utils.settings.sound.sfxVolume);
            var attack = this.character.getEffectiveAttack(modifier), defense = target.getEffectiveDefense(),
                damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
            if (damage < 0) damage = 0;
            target.damage(damage);
        }

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, false);
        tweenTo.onComplete.addOnce(performAttack.bind(this, target), this);

        tweens.push(tweenTo);

        var enemyCombatants = [];

        combatants.forEach(function (combatant) {
            if (combatant.team !== this.character.team) {
                enemyCombatants.push(combatant);
            }
        }, this);

        for (var i = 0; i < attackCount; i++) {
            if (enemyCombatants.length > 0) {
                var targetCombatant = enemyCombatants[this.game.rnd.integerInRange(0, enemyCombatants.length - 1)];
                tweens.push(this.game.add.tween(actor).to({ x: targetCombatant.x, y: targetCombatant.y }, 800, Phaser.Easing.Bounce.Out, false));
                tweens[index].onComplete.addOnce(performAttack.bind(this, targetCombatant), this);
                tweens[index - 1].chain(tweens[index]);
                index++;
            }
        }

        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);
        tweens[0].start();
        tweens[tweens.length - 1].chain(tweenBack);

        return tweenBack;
    };

    execution.attackAllAtOnce = function (target, modifier) {
        var actor = this;

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.chain(tweenBack);

        var damageList = [];

        tweenTo.onComplete.addOnce(function () {
            this.game.sound.play('sword', this.game.utils.settings.sound.sfxVolume);
            this.character.parent.forEach(function (combatant) {
                if (combatant.team !== this.character.team) {
                    var attack = this.character.getEffectiveAttack(modifier), defense = combatant.getEffectiveDefense(),
                        damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
                    if (damage < 0) damage = 0;

                    // there's a chance we killed a combatant while iterating, so we can't deal the damage until iteration is over.
                    damageList.push({ combatant: combatant, damage: damage });
                }
            }, this);

            for (var i in damageList) {
                damageList[i].combatant.damage(damageList[i].damage);
            };

        }, this);

        return tweenBack;
    };

    execution.healSingleTarget = function (target, modifier) {
        var initialPosition = { x: this.character.position.x, y: this.character.position.y },
            actor = this,
            characterPosition = this.character.position,
            targetPosition = target.position;

        var tweenTo = this.game.add.tween(actor).to({ x: targetPosition.x, y: targetPosition.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: initialPosition.x, y: initialPosition.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.onComplete.addOnce(function () {
            var power = this.character.getEffectiveAttack(modifier),
                heal = this.game.rnd.integerInRange(1, 6) + power;
            if (heal < 1) heal = 1;
            target.heal(heal);
        }, this);

        tweenTo.chain(tweenBack);

        return tweenBack;
    };

    execution.healParty = function (target, modifier) {
        var actor = this;

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.chain(tweenBack);

        tweenTo.onComplete.addOnce(function () {
            this.character.parent.forEach(function (combatant) {
                if (combatant.team === this.character.team) {
                    var power = this.character.getEffectiveAttack(modifier),
                        heal = this.game.rnd.integerInRange(1, 6) + power;
                    if (heal < 1) heal = 1;
                    combatant.heal(heal);
                }
            }, this);

        }, this);

        return tweenBack;
    };

    execution.applyStatusToSingleTarget = function (target, statusTypes, duration, power) {
        var actor = this,
            targetPosition = target.position;

        var tweenTo = this.game.add.tween(actor).to({ x: targetPosition.x, y: targetPosition.y }, 500, Phaser.Easing.Bounce.Out, true);

        tweenTo.onComplete.addOnce(function () {
            for (var i = 0; i < statusTypes.length; i++) {
                target.status.addEffect(statusTypes[i], duration || 1000, power);
            }
        }, this);

        return tweenTo;
    };

    execution.applyStatusToRank = function (target, statusTypes, duration, power) {
        var actor = this;

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.chain(tweenBack);

        tweenTo.onComplete.addOnce(function () {
            this.character.parent.forEach(function (combatant) {
                if (combatant.team === target.team && combatant.type === target.type) {
                    for (var i = 0; i < statusTypes.length; i++) {
                        combatant.status.addEffect(statusTypes[i], duration || 1000, power);
                    }
                }
            }, this);

        }, this);

        return tweenBack;
    };

    execution.applyStatusToParty = function (target, statusTypes, duration, power) {
        var actor = this;

        var tweenTo = this.game.add.tween(actor).to({ x: target.x, y: target.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: this.character.x, y: this.character.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.chain(tweenBack);

        tweenTo.onComplete.addOnce(function () {
            this.character.parent.forEach(function (combatant) {
                if (combatant.team === target.team) {
                    for (var i = 0; i < statusTypes.length; i++) {
                        combatant.status.addEffect(statusTypes[i], duration || 1000, power);
                    }
                }
            }, this);

        }, this);

        return tweenBack;
    };

    var SpecialFactory = {};

    SpecialFactory.create = function (game, character, key, customTexture) {
        return assembleSpecial(game, character, key, customTexture);
    };

    return SpecialFactory;
});