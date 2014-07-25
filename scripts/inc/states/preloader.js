// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />

define("Preloader", ['Phaser'],	function(Preloader) {
    'use strict';
    app.Preloader = function (game) {
       
    };

    app.Preloader.prototype = {
        preload: function () {

            game.stage.backgroundColor = '#FFFFFF';

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(175, 280, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.onFileStart.add(function (percentage, asset) {
                fileText.text = 'loading: ' + asset;
            });
            this.load.onFileComplete.add(function (percentage, asset, p3, p4, p5) {
                percentageText.text = percentage + ' %';
                if (percentage > 55) {
                    percentageText.style.fill = '#FFFFFF';
                }
            });

            // set screen background
            game.utils.stretchAndFitImage('preloader');

            // create texts for progress 
            var percentageStyle = { font: '64px Colonna MT', fill: '#7F0000', align: 'center' };
            var percentageText = game.add.text(game.width / 2, 380, '0 %', percentageStyle);
            percentageText.anchor.setTo(0.5, 0.5);
            var fileStyle = { font: '36px Colonna MT', fill: '#303030', align: 'center' };
            var fileText = game.add.text(game.width / 2, 480, '', fileStyle);
            fileText.anchor.setTo(0.5, 0.5);

            // load screens
            game.load.image('menu', 'assets/screens/menu.png');
            game.load.image('new', 'assets/screens/new.png');
            game.load.image('play', 'assets/screens/play.png');
            game.load.image('battle-dirt', 'assets/screens/battle-dirt.png');
            game.load.image('battle-grass', 'assets/screens/battle-grass.png');
            game.load.image('battle-siege', 'assets/screens/battle-siege.png');
            game.load.image('shop', 'assets/screens/shop.png');
            game.load.image('victory', 'assets/screens/victory.png');
            game.load.image('defeat', 'assets/screens/defeat.png');

            // load characters
            game.load.image('warrior', 'assets/players/warrior.png');
            game.load.image('cleric', 'assets/screens/cleric.png');
            game.load.image('ranger', 'assets/screens/ranger.png');

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

            // add a little delay since the progress bar at the end is not seen
            window.setTimeout(function () {
                game.state.start('Menu');
            }, 500);
        },
        update: function(){}
    };
});