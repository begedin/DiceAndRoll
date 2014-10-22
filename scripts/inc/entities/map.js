/*globals define*/

/*
    Map is the draggable map used in the play screen. It encapsulates the logic needed
    for it to be draggable within the proper constraints and holds the actual map data

    Ideally, this would be a group, also holding a pinpoint child group, but for now, it works as a sprite,
    while the pinpoints are handled in the parent, state module.
*/

define([
    'Phaser'
], function (Phaser) {

    var MAP_AREA = new Phaser.Rectangle(414, 152, 700, 660);

    var Map = function (game, id, data) {
        this.game = game;

        this.id = id;
        this.investigated = false;
        this.cleared = false;

        Phaser.Sprite.call(this, this.game, MAP_AREA.left, MAP_AREA.top, id);

        this.data = data || JSON.parse(this.game.cache.getText(id));

        this.inputEnabled = true;

        var boundsRect = new Phaser.Rectangle(
            MAP_AREA.right - this.width,
            MAP_AREA.bottom - this.height,
            2 * (this.width - MAP_AREA.width) + MAP_AREA.width,
            2 * (this.height - MAP_AREA.height) + MAP_AREA.height);

        this.input.boundsRect = boundsRect;

        //  do not snap to center, do not bring to top
        this.input.enableDrag(false, false);
    };

    Map.prototype = Object.create(Phaser.Sprite.prototype);
    Map.prototype.constructor = Map;

    Map.prototype.update = function () {
    };

    return Map;
});