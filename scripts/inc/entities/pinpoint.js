define(['Phaser'], function (Phaser) {

    var Pinpoint = function (game, map, data) {
        this.game = game;
        this.map = map;
        this.data = data;

        Phaser.Sprite.call(this, this.game, parseInt(data.x, 10) / 100 * this.map.width, parseInt(data.y, 10) / 100 * this.map.height, 'location', 0);
        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.onClicked, this);
        this.data = data;

        this.investigated = false;
        this.cleared = false;
        this.visible = false;
        this.current = false;

        this.events.onVisitedInfo = new Phaser.Signal();
        this.events.onInvestigatedInfo = new Phaser.Signal();
        this.events.onClearedInfo = new Phaser.Signal();
        this.neigbors = [];

        this.tweens = {
            currentIndicator: this.game.add.tween(this).to({ angle: 5 }, 200, Phaser.Easing.Quadratic.In, false, 0, Number.MAX_VALUE, true)
        };
    };

    Pinpoint.prototype = Object.create(Phaser.Sprite.prototype);
    Pinpoint.prototype.constructor = Pinpoint;

    Pinpoint.prototype.update = function () {

        for (var i in this.neighbors) {
            if (this.neighbors[i].cleared) this.visible = true;
        }

        if (this.cleared) {
            this.frame = 4;
        } else if (this.investigated) {
            // set correct frame
        }

        if (this.current) {
            this.visible = true;
            if (!this.tweens.currentIndicator._lastChild.isRunning) this.tweens.currentIndicator.start();
        } else {
            this.tweens.currentIndicator.stop();
        }
    };

    Pinpoint.prototype.onClicked = function () {

        if (!this.visible) return;


        else if (!this.investigated) this.events.onVisitedInfo.dispatch(this, this.data);
        else if (this.investigated && !this.cleared) this.events.onInvestigatedInfo.dispatch(this, this.data);
        else if (this.investigated && this.cleared) this.events.onClearedInfo.dispatch(this, this.data);

        this.current = true;
    };

    Pinpoint.prototype.explore = function () {
        this.investigated = true;
        this.events.onInvestigatedInfo.dispatch(this, this.data);
    };

    Pinpoint.prototype.clear = function () {
        this.cleared = true;
    };

    Pinpoint.prototype.setNeighbors = function (neighbors) {
        this.neighbors = neighbors;
    };

    return Pinpoint;
});