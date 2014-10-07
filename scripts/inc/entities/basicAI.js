define([
    'Phaser',
], function (Phaser) {

    var BasicAI = function (game, character) {
        this.game = game;
        this.character = character;
        this.character.customEvents.onReady.add(this.act, this, 0);
    }

    BasicAI.prototype.act = function () {

        var selectedMove = this.character.specials.getRandom(),
            potentialTargets = selectedMove.getTargets();

        this.character.selectMove(selectedMove);
        this.game.time.events.add(Phaser.Timer.HALF, function () {
            var index = this.game.rnd.integerInRange(0, potentialTargets.length - 1);
            selectedMove.executeAndNotify(potentialTargets[index]);
        }, this);
    };

    return BasicAI;
});