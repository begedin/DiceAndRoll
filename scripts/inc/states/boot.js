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
            game.load.image('preloader', 'assets/screens/preloader2.png');
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

            game.assets = {};
            game.assets.characters = [
                { name: 'warrior', title: 'Warrior', desc: 'This is a character with melee attack,\n making your ranged party members less vulnerable.', hp: 100, ac: 5, at: 20, type: 'MELEE', weapon: 'Two-handed axe' },
                { name: 'cleric', title: 'Cleric', desc: 'This is a character that acts as both\n melee combatant and healer.', hp: 120, ac: 4, at: 15, type: 'HEALER', weapon: 'Potions and sword' },
                { name: 'ranger', title: 'Ranger', desc: 'This is a ranged attack character,\n having the advantage not been directly\n exposed to an enemy fire.', hp: 80, ac: 3, at: 12, type: 'RANGED', weapon: 'Longbow' }
            ];

            game.state.start('Preloader');
        },
        update: function() {}
    };
});