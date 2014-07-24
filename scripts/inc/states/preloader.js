// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />

define("Preloader", ['Phaser'],	function(Preloader) {
    'use strict';
    app.Preloader = function (game) {
        
    };

    app.Preloader.prototype = {
        preload: function () {
            game.stage.backgroundColor = '#FFFFFF'; //'#182d3b';

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(175, 280, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            // set screen background
            game.utils.stretchAndFitImage('preloader');

            // load screens
            game.load.image('menu', 'assets/screens/menu.jpg');
            game.load.image('new', 'assets/screens/play.jpg');
            game.load.image('play', 'assets/screens/play.jpg');
            game.load.image('battle-dirt', 'assets/screens/battle-dirt.jpg');
            game.load.image('battle-grass', 'assets/screens/battle-grass.jpg');
            game.load.image('battle-siege', 'assets/screens/battle-siege.jpg');
            game.load.image('shop', 'assets/screens/shop.png');
            game.load.image('victory', 'assets/screens/victory.png');
            game.load.image('defeat', 'assets/screens/defeat.png');

            // load assets
            game.load.spritesheet('ground', 'assets/ground.png', 100, 100);
            game.load.spritesheet('check', 'assets/check_button.png', 38, 36);
            game.load.spritesheet('token_red', 'assets/token_red.png', 36, 36);
            game.load.spritesheet('token_red_selected', 'assets/token_red_selected.png', 36, 36);
            game.load.spritesheet('token_blue', 'assets/token_blue.png', 36, 36);
            game.load.spritesheet('token_blue_selected', 'assets/token_blue_selected.png', 36, 36);
            game.load.spritesheet('bg', 'assets/bg.png', 800, 174);
        },
        create: function () {

            //var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            //tween.onComplete.add(function () { game.state.start('Menu', true, false); }, this);

            //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

            //// set screen background
            //var image = game.add.sprite(game.world.centerX, game.world.centerY, 'preloader');
            //image.anchor.set(0.5);

            //game.stage.backgroundColor = '#000';

            //game.scale.startFullScreen();

            // Stretch to fill
            //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

            // Keep original size
             //game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

            // Maintain aspect ratio
            // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

            window.setTimeout(function () {
                game.state.start('Menu');
            }, 200);
        },
        update: function(){}
    };
});