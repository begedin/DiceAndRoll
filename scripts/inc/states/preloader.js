// preloader.js
// This javascript file represents phaser state for game loading.

/// <reference path="/scripts/vendor/phaser.js" />
var define = define || {};

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

            if (!this.options.persistMusic) this.game.sound.stopAll();

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
                    this.game.load.image('menu', 'assets/screens/menu_s.png');
                    // ambient music
                    this.game.load.audio('theme', ['assets/sound/looperman-l-0208341-0069234-drmistersir-4moe-xxgrave-robbers.mp3']);
                    // common assets
                    this.game.load.spritesheet('less', 'assets/common/less.png', 80, 80);
                    this.game.load.spritesheet('more', 'assets/common/more.png', 80, 80);
                    // load sound effects
                    this.game.load.audio('sword', ['assets/sound/effects/sword-clang.mp3']);
                    this.game.load.audio('sword2', ['assets/sound/effects/sword-clang3.mp3']);
                    break;
                case 'New':
                    // background screen
                    this.game.load.image('new', 'assets/screens/new_s.png');
                    // load characters
                    for (var charIndex in this.game.assets.characters) {
                        var character = this.game.assets.characters[charIndex];
                        this.game.load.image(character.name, 'assets/players/' + character.name + '_s.png');
                    }
                    // load campaigns 
                    this.game.assets.campaigns.forEach(function (campaign) {
                        this.game.load.image(campaign.name, 'assets/campaigns/' + campaign.name + '_s.png');
                    }, this);
                    // common assets
                    this.game.load.image('arrow', 'assets/common/arrow.png');
                    // load sound effects
                    this.game.load.audio('page', ['assets/sound/effects/page-flip-01a.mp3']);
                    this.game.load.audio('page2', ['assets/sound/effects/page-flip-02.mp3']);
                    this.game.load.audio('gong', ['assets/sound/effects/Metal_Gong-Dianakc-109711828.mp3']);
                    this.game.load.audio('swords', ['assets/sound/effects/Swords_Collide-Sound_Explorer-2015600826.mp3']);
                    break;
                case 'Play':
                    // background screen
                    this.game.load.image('play', 'assets/screens/play_s.png');
                    // ambient music
                    this.game.load.audio('play', ['assets/sound/looperman-l-1059144-0066791-ebaby8119-intro-loop.mp3']);
                    // load maps
                    this.options.campaign.maps.forEach(function (map) {
                        this.game.load.image(map.map, 'assets/maps/' + map.map + '.png');
                        this.game.load.text(map.map, 'data/maps/' + map.map + '.json');
                    }, this);
                    // load sprites
                    this.game.load.image('pixel_white', 'assets/pixel_white.png');
                    this.game.load.spritesheet('location', 'assets/common/locations.png', 80, 80);
                    break;
                case 'Battle':
                    // background screen
                    this.game.load.image('battle_' + this.options.terrain, 'assets/screens/battle_' + this.options.terrain + '_s.png');
                    // ambient music
                    if (this.options.terrain === 'grass') {
                        this.game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0075453-anubis-tribal-escape-02.mp3']);
                    } else if (this.options.terrain === 'dirt') {
                        this.game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0074960-anubis-tribal-percussion-07.mp3']);
                    } else if (this.options.terrain === 'siege') {
                        this.game.load.audio('battle-' + this.options.terrain, ['assets/sound/looperman-l-0202721-0074435-anubis-tribal-percussion-01.mp3']);
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

                    this.game.load.image('specials/rage', 'assets/specials/rage.png');
                    this.game.load.image('specials/chain_attack', 'assets/specials/chain_attack.png');
                    this.game.load.image('specials/ground_strike', 'assets/specials/ground_strike.png');
                    this.game.load.image('specials/elemental_fear', 'assets/specials/elemental_fear.png');

                    this.game.load.image('specials/healing_potion', 'assets/specials/healing_potion.png');
                    this.game.load.image('specials/bless', 'assets/specials/bless.png');
                    this.game.load.image('specials/negate_spell', 'assets/specials/negate_spell.png');
                    this.game.load.image('specials/team_heal', 'assets/specials/team_heal.png');

                    this.game.load.image('specials/bullseye', 'assets/specials/bullseye.png');
                    this.game.load.image('specials/tripple_shot', 'assets/specials/tripple_shot.png');
                    this.game.load.image('specials/fire_arrow', 'assets/specials/fire_arrow.png');
                    this.game.load.image('specials/drain_arrow', 'assets/specials/drain_arrow.png');

                    this.game.load.image('specials/electric_shock', 'assets/specials/electric_shock.png');
                    this.game.load.image('specials/poison_gas', 'assets/specials/poison_gas.png');
                    this.game.load.image('specials/mechanical_arm', 'assets/specials/mechanical_arm.png');
                    this.game.load.image('specials/fusion_cannon', 'assets/specials/fusion_cannon.png');

                    this.game.load.image('specials/attack_claws', 'assets/specials/attack_claws.png');
                    this.game.load.image('specials/tail_strike', 'assets/specials/tail_strike.png');
                    this.game.load.image('specials/deadly_bite', 'assets/specials/deadly_bite.png');
                    this.game.load.image('specials/brutal_flame', 'assets/specials/brutal_flame.png');

                    this.game.load.image('specials/leadership', 'assets/specials/leadership.png');
                    this.game.load.image('specials/holy_weapon', 'assets/specials/holy_weapon.png');
                    this.game.load.image('specials/sturded_armor', 'assets/specials/sturded_armor.png');
                    this.game.load.image('specials/call_of_griffin', 'assets/specials/call_of_griffin.png');

                    break;

                case 'End':
                    // background screen
                    // ambient music
                    if (this.options.outcome === 'VICTORY') {
                        this.game.load.image('victory', 'assets/screens/victory_s.png');
                        this.game.load.audio('victory', ['assets/sound/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.mp3']);
                    } else {
                        this.game.load.image('defeat', 'assets/screens/defeat_s.png');
                        this.game.load.audio('defeat', ['assets/sound/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.mp3']);
                    }

                    break;
                default: // unsorted, for now
                    // load screens
                    this.game.load.image('shop', 'assets/screens/shop_1188.png');
            }
        },
        create: function () {
            if (!this.options.persistMusic && this.game.utils.settings.sound.musicVolume > 0) {
                this.music = this.game.add.audio('interlude');
                this.music.play('', 0, 1, true);
            }

            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();

            this.finished = true;
        },
        update: function () {
            // check if the loading is over and prepare transition
            if (this.finished === true) {
                // if the music is turned on, fade out music until mute
                if (!this.options.persistMusic && this.game.utils.settings.sound.musicVolume > 0 && this.music.volume > 0) {
                    //this.music.volume -= 0.01;
                    this.music.volume = Math.round((this.music.volume - 0.01) * 100) / 100;
                } else {
                    // switch to the next state (fading out of music is over)
                    this.game.state.start(this.stateForLoading, true, false, this.options);
                }
            }
        }
    };

    return Preloader;
});