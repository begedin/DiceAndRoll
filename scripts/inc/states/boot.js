// boot.js
// This javascript file represents phaser state for game start.

/// <reference path="/scripts/vendor/phaser.js" />

define("Boot", ['Phaser'], function (Phaser) {
	'use strict';	
    app.Boot = function (game) {

    };

    app.Boot.prototype = {
        preload: function(){
            // Load assets required for preLoader (progress bar, etc.)
            game.load.image('preloadBar', 'assets/screens/progressbar.png');
            game.load.image('preloader', 'assets/screens/preloader.png');
            // Load config
        },
        create: function () {

            this.game.globals = {
                VIRTUAL_WIDTH: 480,
                VIRTUAL_HEIGHT: 800,
                BOARD_SIZE: {
                    x: 3,
                    y: 4
                }
            };

            game.utils = {};
            game.utils.stretchAndFitImage = function (name) {

                var asset = game.cache.getImage(name);
                if (game.width != asset.width || game.height != asset.height) {
                    var ratio = Math.min(game.width / asset.width, game.height / asset.height);
                    var position = { x: (game.width - asset.width * ratio) / 2, y: (game.height - asset.height * ratio) / 2 };
                    var asset = game.add.sprite(position.x, position.y, name);
                    asset.scale.setTo(ratio, ratio);
                    return asset;
                } else {
                    return game.add.sprite(0, 0, name);
                }
            };

            game.state.start('Preloader');
        },
        update: function() {}
    };
});