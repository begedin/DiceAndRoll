/*globals define*/

define(['Phaser'], function (Phaser) {

    var SPECIAL_SIZE = 100,
        SPECIAL_NAME_STYLE = { font: '24px Berkshire Swash', fill: '#7F5935', align: 'center'},
        SPECIAL_DESCRIPTION_STYLE = { font: '20px Berkshire Swash', fill: '#7F460F', align: 'center'};

    var Special = function (game, character, texture) {
        this.game = game;
        this.character = character;

        Phaser.Sprite.call(this, this.game, 0, 0, texture);
        this.anchor.setTo(0.5);
        this.kill();

        this.executed = new Phaser.Signal();
    };

    Special.prototype = Object.create(Phaser.Sprite.prototype);
    Special.prototype.constructor = Special;

    Special.prototype.select = function () {
        if (this.isSelected) return;

        this.isSelected = true;

        this.angle = -5;
        if (!this.activeTween || !this.activeTween.isRunning) this.activeTween = this.game.add.tween(this).to({ angle: 5 }, 200, Phaser.Easing.Quadratic.In, false, 0, Number.MAX_VALUE, true);
        this.activeTween.start();

        this.unsetTargets();
        if (this.getTargets && !this.character.ai) this.setTargets(this.getTargets());

        this.nameText = this.game.add.text(this.game.width / 2, this.game.height / 2 + 50, this.name, SPECIAL_NAME_STYLE);
        this.nameText.anchor.setTo(0.5, 0);
        this.descriptionText = this.game.add.text(this.game.width / 2, this.game.height / 2 + 75, this.description, SPECIAL_DESCRIPTION_STYLE);
        this.descriptionText.anchor.setTo(0.5, 0);
    };

    Special.prototype.deselect = function () {
        if (!this.isSelected) return;

        this.isSelected = false;
        if (this.activeTween) this.activeTween.stop();
        this.angle = 0;

        if (this.nameText) this.nameText.destroy();
        if (this.descriptionText) this.descriptionText.destroy();
    };

    Special.prototype.executeAndNotify = function (target) {

        this.deselect();
        this.unsetTargets();

        var promise;

        switch (this.executionType) {
            case 'attackSingleTarget':
            case 'attackRandomInSequence':
                promise = this.execute(target, this.attackCount, this.modifier);
                break;
            case 'attackRankAtOnce':
            case 'attackRankInSequence':
            case 'attackAllAtOnce':
            case 'healSingleTarget':
                promise = this.execute(target, this.modifier);
                break;
            case 'applyStatusToSingleTarget':
            case 'applyStatusToRank':
            case 'applyStatusToParty':
                promise = this.execute(target, this.statusTypes, this.duration, this.power);
                break;
            default:
                promise = this.execute(target);
                break;
        }

        promise.onComplete.addOnce(function () { this.executed.dispatch(); }, this);
    };

    Special.prototype.setTargets = function (targets) {
        for (var i in targets) {
            var target = targets[i];

            target.originalY = target.y;
            if (!target.selectableTween || !target.selectableTween.isRunning) target.selectableTween = this.game.add.tween(target).to({ y: target.y + 5 }, 200, Phaser.Easing.Quadratic.In, false, 0, Number.MAX_VALUE, true);
            target.selectableTween.start();

            target.customEvents.onInputDown.removeAll();
            target.customEvents.onInputDown.addOnce(this.executeAndNotify, this);
        }
    };

    Special.prototype.unsetTargets = function () {
        var combatants = this.character.parent;

        combatants.forEach(function (target) {
            target.customEvents.onInputDown.removeAll();
            if (target.selectableTween) target.selectableTween.stop();
            target.y = target.originalY || target.y;
        }, this);

    };

    Special.prototype.setData = function (data) {
        this.name = data.name;
        this.description = data.description;
        this.targetType = data.targetType;
        this.executionType = data.executionType;
        this.attackCount = data.attackCount;
        this.modifier = data.modifier;
        this.statusTypes = data.statusTypes;
        this.duration = data.duration;
        this.power = data.power;
    };

    return Special;
});