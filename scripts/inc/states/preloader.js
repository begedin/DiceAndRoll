/*globals define*/

// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />

define(['Phaser'],	function(Phaser) {
    'use strict';
    var Preloader = function (game) {
        this.game = game;
    };

    Preloader.prototype = {
        init: function(state, options) {
            this.options = options;
            this.stateForLoading = state;
        },
        preload: function () {

            if (!this.options.persistMusic) {
                this.game.sound.stopAll();
                if (this.game.utils.settings.sound.musicVolume > 0) {
                    this.music = this.game.add.audio('interlude');
                    this.music.play('', 0, 0, true);

                    // hack looping sound
                    this.music.onLoop.add(function() {
                        this.music.play('', 0, this.game.utils.settings.sound.musicVolume, true);
                    }, this);                    
                }
            }

            this.game.stage.backgroundColor = '#FFFFFF';

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
            this.game.utils.stretchAndFitImage(this.game, 'preloader');

            // create texts for progress 
            var percentageStyle = { font: '64px ' + this.game.utils.fontFamily, fill: '#7F0000', align: 'center' };
            var percentageText = this.game.add.text(this.game.width / 2, 380, '0 %', percentageStyle);
            percentageText.anchor.setTo(0.5, 0.5);
            var fileStyle = { font: '36px ' + this.game.utils.fontFamily, fill: '#303030', align: 'center' };
            var fileText = this.game.add.text(this.game.width / 2, 480, '', fileStyle);
            fileText.anchor.setTo(0.5, 0.5);

            switch (this.stateForLoading) {
                case 'Menu':
                    // background screen
                    this.game.load.image('menu', 'assets/screens/menu_noir.png');
                    // ambient music
                    this.game.load.audio('theme', [
                        'assets/sound/loops/looperman-l-0208341-0069234-drmistersir-4moe-xxgrave-robbers.ogg',
                        'assets/sound/loops/looperman-l-0208341-0069234-drmistersir-4moe-xxgrave-robbers.mp3'
                    ]);
                    // common assets
                    this.game.load.spritesheet('arrows', 'assets/common/arrows.png', 80, 80);
                    this.game.load.image('shield', 'assets/common/shield.png');
                    // load sound effects
                    this.game.load.audio('gong', ['assets/sound/effects/Metal_Gong-Dianakc-109711828.mp3']);
                    // sword audio set:
                    this.game.load.audio('sword', ['assets/sound/effects/sword-clang.ogg', 'assets/sound/effects/sword-clang.mp3']);
                    this.game.load.audio('sword2', ['assets/sound/effects/sword-clang2.ogg', 'assets/sound/effects/sword-clang2.mp3']);
                    this.game.load.audio('sword3', ['assets/sound/effects/sword-clang3.ogg', 'assets/sound/effects/sword-clang3.mp3']);
                    this.game.load.audio('sword4', ['assets/sound/effects/sword-clang4.ogg', 'assets/sound/effects/sword-clang4.mp3']);
                    this.game.load.audio('sword5', ['assets/sound/effects/sword-clang5.ogg', 'assets/sound/effects/sword-clang5.mp3']);
                    break;
                case 'New':
                    // background screen
                    this.game.load.image('new', 'assets/screens/new_noir.png');
                    // load characters
                    for (var charIndex in this.game.assets.characters) {
                        var character = this.game.assets.characters[charIndex];
                        character.specialsUsed = 1;
                        this.game.load.image(character.name, 'assets/players/' + character.name + '_s.png');
                    }
                    // load campaigns 
                    this.game.assets.campaigns.forEach(function (campaign) {
                        this.game.load.image(campaign.name, 'assets/campaigns/' + campaign.name + '_s.png');
                    }, this);
                    // load sound effects
                    // page audio set:
                    this.game.load.audio('page', ['assets/sound/effects/page-flip-01a.ogg', 'assets/sound/effects/page-flip-01a.mp3']);
                    this.game.load.audio('page2', ['assets/sound/effects/page-flip-02.ogg', 'assets/sound/effects/page-flip-02.mp3']);
                    this.game.load.audio('page3', ['assets/sound/effects/page-flip-03.ogg', 'assets/sound/effects/page-flip-03.mp3']);
                    this.game.load.audio('page4', ['assets/sound/effects/page-flip-4.ogg', 'assets/sound/effects/page-flip-4.mp3']);
                    // select audio set:
                    this.game.load.audio('swords', ['assets/sound/effects/Swords_Collide.ogg', 'assets/sound/effects/Swords_Collide.mp3']);
                    break;
                case 'Play':
                    // background screen
                    this.game.load.image('play', 'assets/screens/play_noir.png');
                    // ambient music
                    this.game.load.audio('play', [
                        'assets/sound/loops/looperman-l-1059144-0066791-ebaby8119-intro-loop.ogg',
                        'assets/sound/loops/looperman-l-1059144-0066791-ebaby8119-intro-loop.mp3'
                    ]);
                    // load maps
                    this.options.campaign.maps.forEach(function (map) {
                        this.game.load.image(map.map, 'assets/maps/' + map.map + '.png');
                        this.game.load.text(map.map, 'data/maps/' + map.map + '.json');
                    }, this);
                    // load sprites
                    this.game.load.image('empty', 'assets/common/pixel_white.png');
                    this.game.load.spritesheet('location', 'assets/common/locations_s.png', 80, 80);
                    // load sound effects
                    this.game.load.audio('coins', ['assets/sound/effects/coins-to-table-1.mp3']);
                    this.game.load.audio('horn', ['assets/sound/effects/foghorn.mp3']);
                    // page audio set:
                    this.game.load.audio('page', ['assets/sound/effects/page-flip-01a.ogg', 'assets/sound/effects/page-flip-01a.mp3']);
                    this.game.load.audio('page2', ['assets/sound/effects/page-flip-02.ogg', 'assets/sound/effects/page-flip-02.mp3']);
                    this.game.load.audio('page3', ['assets/sound/effects/page-flip-03.ogg', 'assets/sound/effects/page-flip-03.mp3']);
                    this.game.load.audio('page4', ['assets/sound/effects/page-flip-4.ogg', 'assets/sound/effects/page-flip-4.mp3']);
                    // select audio set:
                    this.game.load.audio('swords', ['assets/sound/effects/Swords_Collide.ogg', 'assets/sound/effects/Swords_Collide.mp3']);
                    break;
                case 'Battle':
                    // background screen
                    this.game.load.image('battle_' + this.options.terrain, 'assets/screens/battle_' + this.options.terrain + '_noir.png');
                    // ambient music
                    if (this.options.terrain === 'grass') {
                        this.game.load.audio('battle_' + this.options.terrain,
                            ['assets/sound/loops/looperman-l-0202721-0075453-anubis-tribal-escape-02.ogg',
                                'assets/sound/loops/looperman-l-0202721-0075453-anubis-tribal-escape-02.mp3']);
                    } else if (this.options.terrain === 'dirt') {
                        this.game.load.audio('battle_' + this.options.terrain,
                            ['assets/sound/loops/looperman-l-0202721-0074960-anubis-tribal-percussion-07.ogg',
                                'assets/sound/loops/looperman-l-0202721-0074960-anubis-tribal-percussion-07.mp3']);
                    } else if (this.options.terrain === 'siege') {
                        this.game.load.audio('battle_' + this.options.terrain,
                            ['assets/sound/loops/looperman-l-0202721-0074435-anubis-tribal-percussion-01.ogg',
                                'assets/sound/loops/looperman-l-0202721-0074435-anubis-tribal-percussion-01.mp3']);
                    }
                    // load characters in party
                    this.options.playerParty.forEach(function (character) {
                        this.game.load.image('characters/' + character.name, 'assets/players/' + character.name + '_s.png');
                    }, this);
                    // load monsters in battle
                    this.options.enemyParty.forEach(function (monster) {
                        this.game.load.image('monsters/' + monster.name, 'assets/monsters/' + monster.name + '_s.png');
                    }, this);
                    // sound effects
                    this.game.load.audio('hit', ['assets/sound/effects/Swoosh02.mp3']);
                    this.game.load.audio('multi-hit', ['assets/sound/effects/SwooshCombo1.mp3']);
                    this.game.load.audio('multi-hit2', ['assets/sound/effects/SwooshCombo2.mp3']);
                    this.game.load.audio('click', ['assets/sound/effects/mechanical-clonk-1.mp3']);
                    this.game.load.audio('click2', ['assets/sound/effects/smack-1.mp3']);
                    // swing audio set:
                    this.game.load.audio('swing', ['assets/sound/effects/swing.ogg', 'assets/sound/effects/swing.mp3']);
                    this.game.load.audio('swing2', ['assets/sound/effects/swing2.ogg', 'assets/sound/effects/swing2.mp3']);
                    this.game.load.audio('swing3', ['assets/sound/effects/swing3.ogg', 'assets/sound/effects/swing3.mp3']);
                    this.game.load.audio('swoosh', ['assets/sound/effects/Swoosh02.ogg', 'assets/sound/effects/Swoosh02.mp3']);
                    // select audio set:
                    this.game.load.audio('swords', ['assets/sound/effects/Swords_Collide.ogg', 'assets/sound/effects/Swords_Collide.mp3']);
                    // load specials
                    for (var special in this.game.assets.specials) {
                        this.game.load.image('specials/' + special, 'assets/specials/' + special + '_s.png');
                    }
                    // TODO: assort these images more efficiently !!!

                    this.game.load.image('cards/back', 'assets/cards/card-back.png');
                    this.game.load.image('cards/front', 'assets/cards/card-front.png');
                    this.game.load.image('cards/faction-1', 'assets/cards/card-faction-1.png');
                    this.game.load.image('cards/faction-2', 'assets/cards/card-faction-2.png');
                    this.game.load.image('cards/emblem-axe', 'assets/cards/card-axe.png');
                    this.game.load.image('cards/emblem-mace', 'assets/cards/card-mace.png');
                    this.game.load.image('cards/emblem-potion', 'assets/cards/card-potion.png');
                    this.game.load.image('cards/emblem-bow', 'assets/cards/card-bow.png');
                    this.game.load.image('cards/emblem-shield', 'assets/cards/card-shield.png');
                    this.game.load.image('cards/emblem-sword', 'assets/cards/card-sword.png');
                    this.game.load.image('cards/emblem-claw', 'assets/cards/card-claw.png');
                    this.game.load.image('cards/emblem-spear', 'assets/cards/card-spear.png');
                    this.game.load.image('cards/emblem-missile', 'assets/cards/card-missile.png');

                    break;

                case 'BattleVictory':
                    this.game.load.image('victory', 'assets/screens/victory_noir.png');
                    this.game.load.audio('victory',
                        [
                            'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.ogg',
                            'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.mp3'
                        ]);

                    // load specials
                    for (var specialKey in this.game.assets.specials) {
                        this.game.load.image('specials/' + specialKey, 'assets/specials/' + specialKey + '_s.png');
                    }

                    // load weapons
                    for (var weaponKey in this.game.assets.weapons) {
                        this.game.load.image('weapons/' + weaponKey, 'assets/weapons/' + weaponKey + '_s.png');
                    }

                    // load armors
                    for (var armorKey in this.game.assets.armors) {
                        this.game.load.image('armors/' + armorKey, 'assets/armors/' + armorKey + '_s.png');
                    }
                    break;

                case 'BattleDefeat':
                    this.game.load.image('defeat', 'assets/screens/defeat_noir.png');
                    this.game.load.audio('defeat',
                        [
                            'assets/sound/loops/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.ogg',
                            'assets/sound/loops/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.mp3']);
                    break;

                case 'MapVictory':
                    this.game.load.image('mapVictory', 'assets/screens/victory_noir.png');
                    this.game.load.audio('mapVictory',
                        [
                            'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.ogg',
                            'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.mp3'
                        ]);
                    break;

                case 'SkirmishEnd':
                    if (this.options.combatResult === 'VICTORY') {
                        this.game.load.image('victory', 'assets/screens/victory_noir.png');
                        this.game.load.audio('victory',
                            [
                                'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.ogg',
                                'assets/sound/loops/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.mp3'
                            ]);
                    } else {
                        this.game.load.image('defeat', 'assets/screens/defeat_noir.png');
                        this.game.load.audio('defeat',
                            [
                                'assets/sound/loops/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.ogg',
                                'assets/sound/loops/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.mp3']);
                    }
                    break;

                default: // unsorted, for now
                    // load screens
                    this.game.load.image('shop', 'assets/screens/shop_1188.png');
            }
        },
        create: function () {

            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();
            var self = this;

            window.setTimeout(function () {
                self.finished = true;
            }, 1000, this);
            
        },
        update: function () {
            // fade in the music
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }

            // check if the loading is over and prepare transition (with some sound loading sync)
            if (this.finished && (this.music.isPlaying ||  this.cache.isSoundDecoded('interlude'))) {
                this.game.state.start(this.stateForLoading, true, false, this.options);
            }
        }
    };

    return Preloader;
});