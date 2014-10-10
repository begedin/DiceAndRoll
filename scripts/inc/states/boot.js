// boot.js
// This javascript file represents phaser state for game start.

/// <reference path="/scripts/vendor/phaser.js" />

define(['Phaser'], function (Phaser) {
    'use strict';


    var Boot = function (game) {
        this.game = game;
    };

    Boot.prototype = {
        preload: function(){
            // Load assets required for preLoader (progress bar, etc.)
            this.game.load.image('preloadBar', 'assets/screens/progressbar.png');
            this.game.load.image('preloader', 'assets/screens/preloader_s.png');
            this.game.load.audio('interlude', ['assets/sound/looperman-l-0079105-0053511-centrist-tales-of-home-guitar.mp3']);

            // load data in JSON files
            this.game.load.text('characters', 'data/characters.json');
            this.game.load.text('monsters', 'data/monsters.json');
            this.game.load.text('campaigns', 'data/campaigns.json');
            this.game.load.text('specials', 'data/specials.json');
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
                this.scale.onResize = this.gameResized.bind(this);
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
                this.scale.setScreenSize(true);
            }

            this.game.utils = {};
            this.game.utils.stretchAndFitImage = function (game, name) {

                var asset = game.cache.getImage(name);
                if (game.width !== asset.width || game.height !== asset.height) {
                    var ratio = Math.min(game.width / asset.width, game.height / asset.height);
                    var position = { x: (game.width - asset.width * ratio) / 2, y: (game.height - asset.height * ratio) / 2 };
                    var sprite = game.add.sprite(position.x, position.y, name);
                    sprite.scale.setTo(ratio, ratio);
                    return sprite;
                } else {
                    return game.add.sprite(0, 0, name);
                }
            };

            this.game.utils.fitImage = function (game, area, name) {

                var asset = game.cache.getImage(name);
                if (area.width !== asset.width || area.height !== asset.height) {
                    var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                    var position = { x: (area.width - asset.width * ratio) / 2, y: (area.height - asset.height * ratio) / 2 };
                    var sprite = game.add.sprite(area.x + position.x, area.y + position.y, name);
                    sprite.scale.setTo(ratio, ratio);
                    return sprite;
                } else {
                    return game.add.sprite(area.x, area.y, name);
                }
            };

            // game settings (TODO: read in from the local storage)
            this.game.utils.settings = {};
            this.game.utils.settings.sound = { musicVolume: 1, sfxVolume: 1 };

            this.game.utils.fontFamily = 'Berkshire Swash'; // alternatives: Handlee, Kaushan Script

            // create object repository for usage in game
            this.game.assets = {};
            this.game.assets.monsters = JSON.parse(this.game.cache.getText('monsters'));
            this.game.assets.characters = JSON.parse(this.game.cache.getText('characters'));
            this.game.assets.campaigns = JSON.parse(this.game.cache.getText('campaigns'));
            this.game.assets.specials = JSON.parse(this.game.cache.getText('specials'));
            //game.state.start('Preloader');
            this.game.state.start('Preloader', true, false, 'Menu', {});
        },
        update: function () {
        },
        gameResized: function (width, height) {

            //  This could be handy if you need to do any extra processing if the game resizes.
            //  A resize could happen if for example swapping orientation on a device.

        },
        enterIncorrectOrientation: function () {

            //app.orientated = false;

            document.getElementById('orientation').style.display = 'block';

        },
        leaveIncorrectOrientation: function () {

            //app.orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }
    };

    return Boot;
});