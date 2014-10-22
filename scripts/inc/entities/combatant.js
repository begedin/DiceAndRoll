/*globals define*/

/* 
Combatant is any combat unit, friend or foe. 
GameObject wise, it's a group consisiting of the character/monster graphic and all other supporting graphics together forming a unit card.
*/

define([
    'Phaser',
    'inc/entities/status'
], function (Phaser, Status) {
    'use strict';
    var TEAMS = { FRIEND: 1, ENEMY: 2 },
        ACTUAL_SIZE = { X: 394, Y: 530 },
        BOUNDS = {
            TOP: -1 * ACTUAL_SIZE.Y / 2,
            BOTTOM: ACTUAL_SIZE.Y / 2,
            LEFT: -1 * ACTUAL_SIZE.X / 2,
            RIGHT: ACTUAL_SIZE.X / 2
        },
        SCALED_SIZE = { X: 153, Y: 220 },
        SPECIAL_ICON_SIZE = 100,
        HEALTH_TEXT_STYLE = { font: '45px Berkshire Swash', fill: '#ffffff', align: 'center' },
        STAT_TEXT_STYLE = { font: '56px Berkshire Swash', fill: '#ffffff', align: 'center' },
        COLOR = {
            RED: 0x990000,
            YELLOW: 0x999900,
            GREEN: 0x009900,
            BLACKISH: 0x11111,
            GRAY: 0x333333
        };

	var Combatant = function (game, team, position, texture, attackTexture) {
        this.game = game;
        this.team = team;
        this.active = false;

        Phaser.Group.call(this, this.game, null, texture);

        // the main sprite, the card background
        this.mainSprite = this.create(0, 0, 'cards/front');
        this.mainSprite.anchor.setTo(0.5, 0.5);

        // the faction emblem, top right corner
        this.factionEmblem = this.create(BOUNDS.RIGHT - 36, BOUNDS.TOP + 46, team === TEAMS.FRIEND ? 'cards/faction-1' : 'cards/faction-2');
        this.factionEmblem.scale.setTo(0.6);
        this.factionEmblem.anchor.setTo(0.5, 0.5);

	    // the attack emblem, bottom left corner
	    // TODO: Add the character specific emblem here
        // TODO: Add attack value display here
        this.attackEmblem = this.create(BOUNDS.LEFT + 38, BOUNDS.BOTTOM - 45, 'cards/emblem-sword');
        this.attackEmblem.anchor.setTo(0.5, 0.5);
        this.attackEmblem.scale.setTo(0.6);
        this.attackText = this.add(new Phaser.BitmapText(this.game, BOUNDS.LEFT + 38, BOUNDS.BOTTOM - 55, 'berkshire', '0', 48));

	    // the defense emblem, bottom right corner
        // TODO: Add defense value display here
        this.defenseEmblem = this.create(BOUNDS.RIGHT - 38, BOUNDS.BOTTOM - 45, 'cards/emblem-shield');
        this.defenseEmblem.scale.setTo(0.6);
        this.defenseEmblem.anchor.setTo(0.5, 0.5);
        this.defenseText = this.add(new Phaser.BitmapText(this.game, BOUNDS.RIGHT - 38, BOUNDS.BOTTOM - 55, 'berkshire', '0', 48));

        this.characterSprite = this.create(0, 0, texture);
        this.characterSprite.scale.setTo((ACTUAL_SIZE.Y - 100) / this.characterSprite.texture.height);
        this.characterSprite.anchor.setTo(0.5, 0.5);

        this.healthIndicator = this.add(new Phaser.BitmapText(this.game, 0, BOUNDS.BOTTOM - 55, 'berkshire', 'Health', 48));

        this.scale.setTo(SCALED_SIZE.X / ACTUAL_SIZE.X, SCALED_SIZE.Y / ACTUAL_SIZE.Y);
        this.position.setTo(position.x, position.y);

        this.currentSpecial = null;

        this.customEvents = {
            onInputDown: new Phaser.Signal(),
            onReady: new Phaser.Signal(),
            onActed: new Phaser.Signal()
        };

        // main sprite imput simply delegates to custom group imput
        this.mainSprite.inputEnabled = true;
        this.mainSprite.events.onInputDown.add(function () {
            this.customEvents.onInputDown.dispatch(this);
        }, this);

        this.mainSprite.events.onKilled.add(this.combatantKilled, this);

        this.status = this.add(new Status(this.game, this));
        this.status.position.setTo(BOUNDS.LEFT + 58, BOUNDS.TOP + 72);

	    // contains the character's moves
        this.specials = this.game.add.group();
        this.specials.exists = false;

        this.stats = {};
    };
    
    Combatant.prototype = Object.create(Phaser.Group.prototype);
    Combatant.prototype.constructor = Combatant;

    Combatant.prototype.activate = function () {

        if (!this.canAct()) {
            this.customEvents.onActed.dispatch();
            return;
        }

        // TODO: Level check to see if special is usable
        this.specials.callAll('revive');
        var specialCount = this.specials.countLiving(); // this will change based on level

        var leftMostPosition = (this.game.width - ((specialCount - 1) * SPECIAL_ICON_SIZE) - ((specialCount - 1) * 10)) / 2,
            y = this.game.height / 2,
            initialPosition = this.position;

        this.specials.forEach(function (special) {

            var index = this.specials.getIndex(special);

            var x = leftMostPosition + (index * SPECIAL_ICON_SIZE) + ((index === 0 ? index : index - 1) * 10);

            special.position.setTo(this.x, this.y);

            var initialScale = 0.1 * SPECIAL_ICON_SIZE / special.texture.height,
                finalScale = SPECIAL_ICON_SIZE / special.texture.height;

            special.scale.setTo(initialScale);
            special.angle = 180;

            special.inputEnabled = true;
            special.events.onInputDown.removeAll();
            special.events.onInputDown.add(this.selectMove, this);

            special.executed.addOnce(this.deactivate, this);

            special.tweenMove = this.game.add.tween(special).to({ angle: 0, x: x, y: y }, 500, Phaser.Easing.Bounce.Out).start();
            special.tweenScale = this.game.add.tween(special.scale).to({ x: finalScale, y: finalScale }, 500, Phaser.Easing.Bounce.Out).start();

        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND, function () {
            this.customEvents.onReady.dispatch();
            if (this.specials.countLiving() > 0 && !this.ai)
                this.selectMove(this.specials.getAt(0));
        }, this);
        this.isAttacking = true;

        this.angle = -5;
        if (!this.activeTween || !this.activeTween.isRunning) this.activeTween = this.game.add.tween(this).to({ angle: 5 }, 200, Phaser.Easing.Quadratic.In, false, 0, Number.MAX_VALUE, true);
        this.activeTween.start();
    };

    Combatant.prototype.deactivate = function () {

        var finalPosition = this.position;

        this.specials.forEach(function (special) {
            var finalScale = 0.1 * SPECIAL_ICON_SIZE / special.texture.height;
            this.game.add.tween(special).to({ angle: 180, x: finalPosition.x, y: finalPosition.y }, 600, Phaser.Easing.Quadratic.Out, true);
            this.game.add.tween(special.scale).to({ x: finalScale, y: finalScale }, 600, Phaser.Easing.Quadratic.Out, true).onComplete.addOnce(special.kill, special);
        }, this);

        this.isAttacking = false;
        if (this.activeTween) this.activeTween.stop();
        this.angle = 0;
        this.customEvents.onActed.dispatch();
    };

    Combatant.prototype.selectMove = function (selectedMove) {

        // TODO: check if first (default) move, then no sound
        this.game.utils.soundsets.swing.play();

        this.selectedMove = selectedMove;
        selectedMove.select(this);
        this.specials.forEach(function (move) {
            if (move !== selectedMove) move.deselect();
        });
    };

    Combatant.prototype.combatantKilled = function () {
        this.customEvents.onReady.removeAll();
        this.parent.remove(this);
    };

    Combatant.prototype.damage = function (value) {
        this.mainSprite.damage(value);
        this.showDamage(value);
    };

    Combatant.prototype.heal = function (value) {
        this.mainSprite.health += value;
        if (this.mainSprite.health > this.stats.maxHealth) this.mainSprite.health = this.stats.maxHealth;
        this.showHealing(value);
    };

    Combatant.prototype.setStats = function (stats) {
        this.stats.maxHealth = stats.maxHealth || stats.health;
        this.mainSprite.health = stats.health ? stats.health : stats.maxHealth;
        this.stats.speed = stats.speed;
        this.stats.attack = stats.attack;
        this.stats.defense = stats.defense;

        this.stats.weapon = stats.weapon;
        this.stats.weaponStats = this.game.assets.weapons[stats.weapon];
        this.stats.armor = stats.sarmor;
        this.stats.armorStats = this.game.assets.armors[stats.armor];
    };

    Combatant.prototype.getStats = function () {
        return {
            health: this.mainSprite.health,
            maxHealth: this.stats.maxHealth,
            speed: this.stats.speed,
            attack: this.stats.attack,
            defense: this.stats.defense,
            weapon: this.stats.weapon,
            armor: this.stats.armor
        };
    };

    Combatant.prototype.attack = function (target) {
        // TODO: use selected skill to attack;
        var initialPosition = { x: this.position.x, y: this.position.y };

        var actor = this.selectedMove ? this.selectedMove : this,
            characterPosition = this.position,
            targetPosition = target.position;

        var tweenTo = this.game.add.tween(actor).to({ x: targetPosition.x, y: targetPosition.y }, 500, Phaser.Easing.Bounce.Out, true);
        var tweenBack = this.game.add.tween(actor).to({ x: initialPosition.x, y: initialPosition.y }, 500, Phaser.Easing.Bounce.Out);

        tweenTo.onComplete.addOnce(function () {
            // ToDo: select proper sound
            this.game.utils.soundsets.sword.play();
            var attack = this.stats.attack || 0, defense = target.stats.defense || 0,
                damage = this.game.rnd.integerInRange(1, 6) + attack - this.game.rnd.integerInRange(1, 6) - defense;
            if (damage < 0) damage = 0;
            target.damage(damage);
        }, this);

        tweenTo.chain(tweenBack);

        return tweenBack;
    };

    Combatant.prototype.showDamage = function (amount) {
        var damageText = this.game.add.text(this.x, this.y, amount.toString(), { font: '65px ' + this.game.utils.fontFamily, fill: '#ff0000', align: 'center' }, this.damageIndicators);
        damageText.anchor.setTo(0.5, 0.5);
        this.game.add.tween(damageText).to({ alpha: 0, y: this.y - 60 }, 600).start().onComplete.add(damageText.destroy.bind(damageText, false));
    };

    Combatant.prototype.showHealing = function (amount) {
        var healingText = this.game.add.text(this.x, this.y, amount.toString(), { font: '65px ' + this.game.utils.fontFamily, fill: '#00ff00', align: 'center' }, this.damageIndicators);
        healingText.anchor.setTo(0.5, 0.5);
        this.game.add.tween(healingText).to({ alpha: 0, y: this.y - 60 }, 600).start().onComplete.add(healingText.destroy.bind(healingText, false));
    };

    Combatant.prototype.getEffectiveAttack = function (modifier) {
        var attack = this.stats.attack +
            (this.stats.weaponStats ? this.stats.weaponStats.attack : 0) +
            this.status.totalAttackMod +
            (modifier || 0);
        return attack > 0 ? attack : 0;
    };

    Combatant.prototype.getEffectiveDefense = function (modifier) {
        var defense = this.stats.defense +
            (this.stats.armorStats ? this.stats.armorStats.defense : 0) +
            this.status.totalDefenseMod +
            (modifier || 0);
        return defense > 0 ? defense : 0;
    };

    Combatant.prototype.canAct = function () {
        return !this.status.hasBlockingEffect();
    };

    Combatant.prototype.update = function () {

        // status is a member of this group, so a group's update method needs to take care of updating it

        this.status.update();

        // update health indicator

        this.healthIndicator.setText(this.mainSprite.health + '/' + this.stats.maxHealth);

        var ratio = this.mainSprite.health / this.stats.maxHealth;
        var healthFont = this.healthIndicator.font;

        if (this.mainSprite.health === this.stats.maxHealth) {
            this.healthIndicator.tint = COLOR.GREEN;
        } else if ((ratio < 1) && (ratio > 1 / 3)) {
            this.healthIndicator.tint = COLOR.YELLOW;
        } else {
            this.healthIndicator.tint = COLOR.RED;
        }

        this.healthIndicator.pivot.setTo(this.healthIndicator.textWidth / 2, this.healthIndicator.textHeight / 2);

        // update attack indicator

        var effectiveAttack = this.getEffectiveAttack(),
            nonModifiedAttack = this.stats.attack + (this.stats.weaponStats ? this.stats.weaponStats.attack : 0);

        this.attackText.setText(effectiveAttack);

        if (effectiveAttack > nonModifiedAttack) {
            this.attackText.tint = COLOR.GREEN;
        } else if (effectiveAttack < nonModifiedAttack) {
            this.attackText.tint = COLOR.RED;
        } else {
            this.attackText.tint = COLOR.BLACKISH;
        }

        this.attackText.pivot.setTo(this.attackText.textWidth / 2, this.attackText.textHeight / 2);

        var effectiveDefense = this.getEffectiveDefense(),
            nonModifiedDefense = this.stats.defense + (this.stats.armorStats ? this.stats.armorStats.defense : 0);

        // update defense indicator

        this.defenseText.setText(effectiveDefense);

        if (effectiveDefense > nonModifiedDefense) {
            this.defenseText.tint = COLOR.GREEN;
        } else if (effectiveAttack < nonModifiedAttack) {
            this.defenseText.tint = COLOR.RED;
        } else {
            this.defenseText.tint = COLOR.BLACKISH;
        }

        this.defenseText.pivot.setTo(this.defenseText.textWidth / 2, this.defenseText.textHeight / 2);
    };

	return Combatant;
});