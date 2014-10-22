/*globals define*/

define(['Phaser'], function (Phaser) {

    var Pinpoint = function (game, map, data) {
        this.game = game;
        this.map = map;

        Phaser.Sprite.call(this, this.game, parseInt(data.x, 10) / 100 * this.map.width, parseInt(data.y, 10) / 100 * this.map.height, 'location', 0);
        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.setCurrent, this);

        this.data = data;
        this.investigated = data.investigated || false;
        this.cleared = data.cleared || false;
        this.visible = data.visible || false;
        this.current = data.current || false;

        this.events.onNewPinpointInfo = new Phaser.Signal();
        this.events.onKnownPinpointInfo = new Phaser.Signal();
        this.events.onClearedPinpointInfo = new Phaser.Signal();
        this.neigbors = [];
    };

    Pinpoint.prototype = Object.create(Phaser.Sprite.prototype);
    Pinpoint.prototype.constructor = Pinpoint;

    Pinpoint.prototype.update = function () {

        for (var i in this.neighbors) {
            if (this.neighbors[i].cleared) this.visible = true;
        }

        if (this.investigated) {
            // set correct frame
            switch (this.data.type) {
                case 'CAMP':
                    this.frame = 1;
                    break;
                case 'ENCOUNTER':
                    this.frame = this.cleared ? 4 : 2;
                    break;
                case 'TREASURE':
                    this.frame = this.cleared ? 4 : 3;
                    break;
                case 'SHOP':
                    this.frame = 5;
                    break;
                case 'INN':
                    this.frame = 6;
                    break;
                default:
                    this.frame = 4;
            }
        } else {
            this.frame = 0;
        }

        if (this.current) {
            this.visible = true;
        }
    };

    Pinpoint.prototype.explore = function () {
        this.investigated = true;
        this.events.onKnownPinpointInfo.dispatch(this, this.data);
    };

    Pinpoint.prototype.clear = function () {
        this.cleared = true;
        this.events.onClearedPinpointInfo.dispatch(this, this.data);
    };

    Pinpoint.prototype.setCurrent = function () {

        if (!this.investigated) this.events.onNewPinpointInfo.dispatch(this, this.data);
        else if (this.investigated && !this.cleared) this.events.onKnownPinpointInfo.dispatch(this, this.data);
        else if (this.investigated && this.cleared) this.events.onClearedPinpointInfo.dispatch(this, this.data);

        this.current = true;
        this.scale.setTo(1);
        if (this.activeTween) this.activeTween.stop();
        this.activeTween = this.game.add.tween(this.scale).to({ x: 1.2, y: 1.2 }, 200, Phaser.Easing.Quadratic.In, false, 0, Number.MAX_VALUE, true);
        this.activeTween.start();
    };

    Pinpoint.prototype.unsetCurrent = function () {
        this.current = false;
        if (this.activeTween) this.activeTween.stop();
        this.scale.setTo(1);
    };

    Pinpoint.prototype.setNeighbors = function (neighbors) {
        this.neighbors = neighbors;
    };

    Pinpoint.prototype.serialize = function () {
        var serialized = this.data;
        serialized.investigated = this.investigated;
        serialized.cleared = this.cleared;
        serialized.visible = this.visible;
        serialized.current = this.current;
        return serialized;
    };

    return Pinpoint;
});