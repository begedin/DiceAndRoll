// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />
var app = app || {};

define("Preloader", ['Phaser'],	function(Preloader) {
    'use strict';
    app.Preloader = function (game) {
        var self = this;

        self.finished = false;
        self.music = undefined;
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
            game.load.image('menu', 'assets/screens/menu_1188.png');
            game.load.image('new', 'assets/screens/new_1188.png');
            game.load.image('play', 'assets/screens/play_1188.png');
            game.load.image('battle-dirt', 'assets/screens/battle-dirt_1188.png');
            game.load.image('battle-grass', 'assets/screens/battle-grass_1188.png');
            game.load.image('battle-siege', 'assets/screens/battle-siege_1188.png');
            game.load.image('shop', 'assets/screens/shop_1188.png');
            game.load.image('victory', 'assets/screens/victory_1188.png');
            game.load.image('defeat', 'assets/screens/defeat_1188.png');

            // load characters
            game.load.image('warrior', 'assets/players/warrior.png');
            game.load.image('cleric', 'assets/players/cleric.png');
            game.load.image('ranger', 'assets/players/ranger.png');

            // load campaigns
            game.load.image('campaign-goblins-keep', 'assets/campaigns/campaign-goblins-keep.png');
            game.load.image('campaign-citadel', 'assets/campaigns/campaign-citadel.png');
            game.load.image('campaign-tomb', 'assets/campaigns/campaign-tomb.png');

            // common assets
            game.load.image('arrow', 'assets/common/arrow.png');
            game.load.image('button', 'assets/common/buttonhlu.bmp');
            game.load.image('pixel_white', 'assets/pixel_white.png');

            // load data in JSON files
            game.load.text('characters', 'data/characters.json');
            game.load.text('campaigns', 'data/campaigns.json');
            //game.load.json('characters', '/data/characters.json');

            // load sounds
            game.load.audio('theme', ['assets/sound/looperman-l-0159051-0074415-minor2go-choirs-of-passion-psalm-22.mp3']);
            game.load.audio('page', ['assets/sound/page-flip-01a.mp3']);
            game.load.audio('page2', ['assets/sound/page-flip-02.mp3']);
            game.load.audio('sword', ['assets/sound/sword-clang.mp3']);
            game.load.audio('gong', ['assets/sound/Metal_Gong-Dianakc-109711828.mp3']);

            // load assets
            game.load.spritesheet('ground', 'assets/ground.png', 100, 100);
            game.load.spritesheet('check', 'assets/check_button.png', 38, 36);
            game.load.spritesheet('token_red', 'assets/token_red.png', 36, 36);
            game.load.spritesheet('token_red_selected', 'assets/token_red_selected.png', 36, 36);
            game.load.spritesheet('token_blue', 'assets/token_blue.png', 36, 36);
            game.load.spritesheet('token_blue_selected', 'assets/token_blue_selected.png', 36, 36);
            game.load.spritesheet('bg', 'assets/bg_faded.png', 800, 174);

            //goblin keep campaign data - possibly move later
            game.load.spritesheet('map_goblins_keep', 'assets/maps/map-goblins-keep.png', 1000, 710);
        },
        create: function () {
            this.music = game.add.audio('drums');
            this.music.play('', 0, 1, true);

            //var characters = JSON.parse(game.cache.getText('characters'));
            //var myJSON = game.cache.getJSON('characters');

            // create object repository for usage in game
            game.assets = {};
            game.assets.characters = JSON.parse(game.cache.getText('characters'));
            game.assets.campaigns = JSON.parse(game.cache.getText('campaigns'));

            this.finished = true;

            // add a little delay since the progress bar at the end is not seen
            window.setTimeout(function () {
                game.state.start('Menu');
            }, 1500);
        },
        update: function () {
            if (this.finished == true && this.music.volume > 0) {
                this.music.volume -= 0.01;
            }
        },
        render: function () {
            //game.debug.soundInfo(game.sound, 20, 32);
        }

    };
});