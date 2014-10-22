/*globals define*/

define([
    'Phaser',
    'inc/entities/levelRewardSelector'
], function (Phaser) {
    'use strict';

    var DEFEAT_TITLE_STYLE = { font: '64px Berkshire Swash', fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: 550, stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE_PRESSED = { font: '36px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };

    var BattleDefeat = function (game) {
        this.game = game;
    };

    BattleDefeat.prototype = {
        init: function (options) {
            this.options = options;
        },
        preload: function () {
        },
        create: function () {

            this.createDefeat();

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
                    this.music = this.game.add.audio('defeat');
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

    BattleDefeat.prototype.createDefeat = function () {
        // background image 
        this.game.utils.stretchAndFitImage(this.game, 'defeat');

        this.titleText = this.game.add.text(this.game.width / 2, 350, 'You have been defeated.', DEFEAT_TITLE_STYLE);
        this.titleText.anchor.setTo(0.5);

        this.continueButton = this.game.add.text(this.game.width / 2, 550, 'Exit', BUTTON_STYLE);
        this.continueButton.anchor.setTo(0.5, 0.5);
        this.continueButton.visible = true;

        this.continueButton.inputEnabled = true;
        this.continueButton.events.onInputDown.add(function (source, cursor) {
            source.setStyle(BUTTON_STYLE_PRESSED);
        }, this);

        this.continueButton.events.onInputUp.add(function (source, cursor) {
            source.setStyle(BUTTON_STYLE);
            this.game.state.start('Preloader', true, false, 'Menu', this.options);
        }, this);

    };

    return BattleDefeat;
});