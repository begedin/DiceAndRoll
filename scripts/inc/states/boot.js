// boot.js
// This javascript file represents phaser state for game start.

/// <reference path="/scripts/vendor/phaser.js" />
var app = app || {};

define("Boot", ['Phaser'], function (Phaser) {
    'use strict';


    app.Boot = function (game) {
        this.game = game;
    };

    app.Boot.prototype = {
        preload: function(){
            // Load assets required for preLoader (progress bar, etc.)
            game.load.image('preloadBar', 'assets/screens/progressbar.png');
            game.load.image('preloader', 'assets/screens/preloader2_1188.png');
            game.load.audio('drums', ['assets/sound/looperman-l-0202721-0075501-anubis-tribal-escape-10.mp3']);
            // Load config
        },
        create: function () {


            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 297;
                this.scale.minHeight = 210;
                this.scale.maxWidth = 1188;
                this.scale.maxHeight = 840;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.setScreenSize(true);
            }
            else {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 297;
                this.scale.minHeight = 210;
                this.scale.maxWidth = 1188;
                this.scale.maxHeight = 840;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.forceOrientation(true, false);
                this.scale.hasResized.add(this.gameResized, this);
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
                this.scale.setScreenSize(true);
            }

            this.state.start('Preloader');

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

            game.utils.fitImage = function (area, name) {

                var asset = game.cache.getImage(name);
                if (area.width != asset.width || area.height != asset.height) {
                    var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                    var position = { x: (area.width - asset.width * ratio) / 2, y: (area.height - asset.height * ratio) / 2 };
                    var asset = game.add.sprite(area.x + position.x, area.y + position.y, name);
                    asset.scale.setTo(ratio, ratio);
                    return asset;
                } else {
                    return game.add.sprite(area.x, area.y, name);
                }
            };

            game.state.start('Preloader');
        },
        update: function () { },
        gameResized: function (width, height) {

            //  This could be handy if you need to do any extra processing if the game resizes.
            //  A resize could happen if for example swapping orientation on a device.

        },
        enterIncorrectOrientation: function () {

            app.orientated = false;

            document.getElementById('orientation').style.display = 'block';

        },
        leaveIncorrectOrientation: function () {

            app.orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }
    };
});