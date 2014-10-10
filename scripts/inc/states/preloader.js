// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />
var define = define || {};

define(['Phaser'],	function(Preloader) {
    'use strict';
    var Preloader = function (game) {
        this.game = game;
    };

    Preloader.prototype = {
        init: function(state, options) {
            this.options = options;

            game.utils.stateForLoading = state;
            game.utils.persistMusic = options.persistMusic;
        },
        preload: function () {

            if (!game.utils.persistMusic) game.sound.stopAll();

            game.stage.backgroundColor = '#FFFFFF';

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(175, 280, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.onFileStart.add(function (percentage, asset) {
                fileText.text = 'loading: ' + asset;
            });
            this.load.onFileComplete.add(function (percentage, asset) {
                percentageText.text = percentage + ' %';
                if (percentage > 55) {
                    percentageText.style.fill = '#FFFFFF';
                }
            });

            // set screen background
            game.utils.stretchAndFitImage('preloader');

            // create texts for progress 
            var percentageStyle = { font: '64px ' + game.utils.fontFamily, fill: '#7F0000', align: 'center' };
            var percentageText = game.add.text(game.width / 2, 380, '0 %', percentageStyle);
            percentageText.anchor.setTo(0.5, 0.5);
            var fileStyle = { font: '36px ' + game.utils.fontFamily, fill: '#303030', align: 'center' };
            var fileText = game.add.text(game.width / 2, 480, '', fileStyle);
            fileText.anchor.setTo(0.5, 0.5);

            switch (game.utils.stateForLoading) {
                case 'Menu':
                    // background screen
                    game.load.image('menu', 'assets/screens/menu_1188.png');
                    // ambient music
                    game.load.audio('theme', ['assets/sound/looperman-l-0208341-0069234-drmistersir-4moe-xxgrave-robbers.mp3']);
                    // common assets
                    game.load.spritesheet('less', 'assets/common/less.png', 80, 80);
                    game.load.spritesheet('more', 'assets/common/more.png', 80, 80);
                    // load sound effects
                    game.load.audio('sword', ['assets/sound/effects/sword-clang.mp3']);
                    game.load.audio('sword2', ['assets/sound/effects/sword-clang3.mp3']);
                    break;
                case 'New':
                    // background screen
                    game.load.image('new', 'assets/screens/new_1188.png');
                    // ambient music
                    // ...
                    // load characters
                    // TODO: load them based on JSON definition file - not fixed!
                    game.load.image('warrior', 'assets/players/warrior.png');
                    game.load.image('cleric', 'assets/players/cleric.png');
                    game.load.image('ranger', 'assets/players/ranger.png');
                    game.load.image('alchemist', 'assets/players/alchemist.png');
                    game.load.image('beast', 'assets/players/beast.png');
                    game.load.image('paladin', 'assets/players/paladin.png');
                    // load campaigns 
                    // TODO: load them based on JSON definition file - not fixed!
                    game.load.image('campaign_goblins_keep', 'assets/campaigns/campaign_goblins_keep.png');
                    game.load.image('campaign_citadel', 'assets/campaigns/campaign_citadel.png');
                    game.load.image('campaign_tomb', 'assets/campaigns/campaign_tomb.png');
                    // common assets
                    game.load.image('arrow', 'assets/common/arrow.png');
                    // load sound effects
                    game.load.audio('page', ['assets/sound/effects/page-flip-01a.mp3']);
                    game.load.audio('page2', ['assets/sound/effects/page-flip-02.mp3']);
                    game.load.audio('gong', ['assets/sound/effects/Metal_Gong-Dianakc-109711828.mp3']);
                    game.load.audio('swords', ['assets/sound/effects/Swords_Collide-Sound_Explorer-2015600826.mp3']);
                    break;
                case 'Play':
                    // background screen
                    game.load.image('play', 'assets/screens/play_1188.png');
                    // ambient music
                    game.load.audio('play', ['assets/sound/looperman-l-1059144-0066791-ebaby8119-intro-loop.mp3']);
                    // load maps
                    this.options.campaign.maps.forEach(function (map) {
                        game.load.image(map.map, 'assets/maps/' + map.map + '.png');
                        game.load.text(map.map, 'data/maps/' + map.map + '.json');
                    });
                    // load sprites
                    game.load.image('pixel_white', 'assets/pixel_white.png');
                    game.load.spritesheet('location', 'assets/common/locations.png', 80, 80);
                    break;
                case 'Battle':
                    // background screen
                    game.load.image('battle-' + this.options.terrain, 'assets/screens/battle-' + this.options.terrain + '_1188.png');
                    // ambient music
                    if (this.options.terrain == 'grass') {
                        game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0075453-anubis-tribal-escape-02.mp3']);
                    } else if (this.options.terrain == 'dirt') {
                        game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0074960-anubis-tribal-percussion-07.mp3']);
                    } else if (this.options.terrain == 'siege') {
                        game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0074435-anubis-tribal-percussion-01.mp3']);
                    }
                    // load characters in party
                    this.options.playerParty.forEach(function (character) {
                        game.load.image('characters/' + character.name, 'assets/players/' + character.name + '.png');
                    });
                    // sound effects
                    game.load.audio('hit', ['assets/sound/effects/Swoosh02.mp3']);
                    game.load.audio('multi-hit', ['assets/sound/effects/SwooshCombo1.mp3']);
                    game.load.audio('multi-hit2', ['assets/sound/effects/SwooshCombo2.mp3']);
                    break;
                default: // unsorted, for now
                    // load screens
                    game.load.image('shop', 'assets/screens/shop_1188.png');
            };
        },
        create: function () {
            if (!game.utils.persistMusic && game.utils.settings.sound.musicVolume > 0) {
                this.music = game.add.audio('interlude');
                this.music.play('', 0, 1, true);
            }

            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();

            this.finished = true;
        },
        update: function () {
            // check if the loading is over and prepare transition
            if (this.finished == true) {
                // if the music is turned on, fade out music until mute
                if (!game.utils.persistMusic && game.utils.settings.sound.musicVolume > 0 && this.music.volume > 0) {
                    //this.music.volume -= 0.01;
                    this.music.volume = Math.round((this.music.volume - 0.01) * 100) / 100;
                } else {
                    // switch to the next state (fading out of music is over)
                    game.state.start(game.utils.stateForLoading, true, false, this.options);
                }
            }
        },
        render: function () {
            //game.debug.soundInfo(game.sound, 20, 32);
            //game.debug.text(this.music.volume, 32, 32);
        }

    };

    return Preloader;
});