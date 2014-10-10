var app = app || {},
    define = define || {};

define([
    'Phaser',
], function (Phaser, CreatureFactory, CharacterFactory) {
    'use strict';

    var DEFEAT_TITLE_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: 550 },
        VICTORY_TITLE_STYLE = { font: '48px Berkshire Swash', fill: '#009900', align: 'center', wordWrap: true, wordWrapWidth: 550 },
        BUTTON_STYLE = { font: '72px Berkshire Swash', fill: '#990000', align: 'center' },
        BUTTON_STYLE_PRESSED = { font: '64px Berkshire Swash', fill: '#FF6A00', align: 'center' };


    var End = function (game) {
        this.game = game;
        this.creatureFactory = CreatureFactory;
        this.characterFactory = CharacterFactory;
    };

    End.prototype = {
        init: function (options) {
            this.options = options;
            this.won = this.options.outcome === 'VICTORY';
        },
        preload: function () {
            if (this.won) {
                this.game.load.image('victory', 'assets/screens/victory_1188.png');
                this.game.load.audio('victory', ['assets/sound/looperman-l-0159051-0054707-minor2go-cinema-pro-the-world.mp3']);
            } else {
                this.game.load.image('defeat', 'assets/screens/defeat_1188.png');
                this.game.load.audio('defeat', ['assets/sound/looperman-l-0159051-0054708-minor2go-cinema-pro-golden-kingdom.mp3']);
            }
        },

        create: function () {

            this.background = this.game.add.sprite(0, 0, this.won ? 'victory': 'defeat');
            var titleText = this.game.add.text(this.game.width / 2, 300, this.won ? 'You have won!' : 'You have been defeated...', this.won ? VICTORY_TITLE_STYLE : DEFEAT_TITLE_STYLE);
            titleText.anchor.setTo(0.5, 0);

            var button = this.game.add.text(this.game.width / 2, 500, this.won ? 'Continue' : 'Exit', BUTTON_STYLE);
            button.anchor.setTo(0.5, 0.5);
            button.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

            button.inputEnabled = true;
            button.events.onInputDown.add(function (source, cursor) {
                source.setStyle(BUTTON_STYLE_PRESSED);
                if (this.won && this.options.campaign) {
                    this.game.state.start('Preloader', true, false, 'Play', this.options);
                } else {
                    this.game.state.start('Preloader', true, false, 'Menu', this.options);
                }
            }, this);


            var music;
            // check if music is enabled
            if (this.game.utils.settings.sound.musicVolume > 0) {
                if (this.music) {
                    // music is already been there, and start playing if stopped
                    if (!this.music.isPlaying) {
                        music = this.music.play('', 0, 0, true);
                    } else music = this.music;
                } else {
                    // introductory fade in of theme music
                    this.game.sound.stopAll();
                    this.music = this.game.add.audio(this.won ? 'victory' : 'defeat');
                    music = this.music.play('', 0, 0, true);
                }
            }
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }
        }
    };

    return End;
});