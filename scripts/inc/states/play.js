var app = app || {},
    define = define || {};

/// currently unused, was the old level loader, without the combat

define("Play", ['Phaser', 'BattleGrid'], function (Play, BattleGrid) {
    'use strict';
    app.Play = function(game){
        this.game = game;
    };

    app.Play.prototype = {
        preload: function () {

        },
        create: function () {
            this.mapArea = new Phaser.Rectangle(414, 152, 700, 660);
            this.map = this.game.add.sprite(this.mapArea.left, this.mapArea.top, 'map_goblins_keep');
            this.map.inputEnabled = true;
            this.map.input.boundsRect = new Phaser.Rectangle(
                this.mapArea.right - this.map.width,
                this.mapArea.bottom - this.map.height,
                2 * (this.map.width - this.mapArea.width) + this.mapArea.width,
                2 * (this.map.height - this.mapArea.height) + this.mapArea.height);

            this.map.input.enableDrag(true);
            this.locationArea = new Phaser.Rectangle(26, 200, 290, 430);
            this.locationBackground = this.game.add.sprite(this.locationArea.left, this.locationArea.top, 'pixel_white');
            this.locationBackground.width = this.locationArea.width;
            this.locationBackground.height = this.locationArea.height;
            this.game.utils.stretchAndFitImage('play');
        },
        update: function(){
        }
    };
});