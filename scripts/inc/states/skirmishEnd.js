/*globals define*/

define([
    'Phaser',
    'inc/entities/levelRewardSelector'
], function (Phaser) {
    'use strict';

    var VICTORY_TITLE_STYLE = { font: '64px Berkshire Swash', fill: '#009900', align: 'center', wordWrap: true, wordWrapWidth: 550, stroke: '#000000', strokeThickness: 2 },
        DEFEAT_TITLE_STYLE = { font: '64px Berkshire Swash', fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: 550, stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE_PRESSED = { font: '36px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };

    var SkirmishEnd = function (game) {
        this.game = game;
    };

    SkirmishEnd.prototype = {
        init: function (options) {
            this.options = options;
        },
        preload: function () {
        },
        create: function () {

            var result = this.options.combatResult.toLowerCase();

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
                    this.music = this.game.add.audio(result);
                    music = this.music.play('', 0, 0, true);
                }
            }

            // background image 
            this.game.utils.stretchAndFitImage(this.game, result);

            if (this.options.combatResult === 'VICTORY') {
                this.titleText = this.game.add.text(this.game.width / 2, 300, 'You have won the battle!', VICTORY_TITLE_STYLE);
                this.continueButton = this.game.add.text(this.game.width / 2, 500, 'Exit', BUTTON_STYLE);
            } else {
                this.titleText = this.game.add.text(this.game.width / 2, 350, 'You have been defeated.', DEFEAT_TITLE_STYLE);
                this.continueButton = this.game.add.text(this.game.width / 2, 550, 'Exit', BUTTON_STYLE);
            }

            this.titleText.anchor.setTo(0.5);
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
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }
        }
    };

    return SkirmishEnd;
});