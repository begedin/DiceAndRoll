/*globals define*/

define([
    'Phaser',
    'inc/entities/levelRewardSelector'
], function (Phaser, LevelRewardSelector) {
    'use strict';

    var VICTORY_TITLE_STYLE = { font: '64px Berkshire Swash', fill: '#009900', align: 'center', wordWrap: true, wordWrapWidth: 550, stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE_PRESSED = { font: '36px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };


    var BattleVictory = function (game) {
        this.game = game;
    };

    BattleVictory.prototype = {
        init: function (options) {
            this.options = options;
        },
        preload: function () {
        },
        create: function () {

            this.createVictory(); 

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
                    this.music = this.game.add.audio('victory');
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

    BattleVictory.prototype.createVictory = function () {
        // background image 
        this.background = this.game.utils.stretchAndFitImage(this.game, 'victory');

        this.titleText = this.game.add.text(this.game.width / 2, 80, 'You have won!', VICTORY_TITLE_STYLE);
        this.titleText.anchor.setTo(0.5);

        this.processedCharacters = 0;

        this.showNextCharacterRewardSelector();
    };

    BattleVictory.prototype.showContinueButton = function () {
        this.continueButton = this.game.add.text(this.game.width / 2 - 25, 500, 'Continue', BUTTON_STYLE);
        this.continueButton.anchor.setTo(0.5, 0.5);

        this.continueButton.inputEnabled = true;
        this.continueButton.events.onInputDown.add(function (source, cursor) {
            source.setStyle(BUTTON_STYLE_PRESSED);
        }, this);

        this.continueButton.events.onInputUp.add(function (source, cursor) {
            source.setStyle(BUTTON_STYLE);
            if (this.options.campaign) {
                this.game.state.start('Preloader', true, false, 'Play', this.options);
            } else {
                this.game.state.start('Preloader', true, false, 'Menu', this.options);
            }
        }, this);
    };

    BattleVictory.prototype.showNextCharacterRewardSelector = function () {

        if (this.rewardSelector) {
            this.rewardSelector.removeAll(true);
        }

        if (this.processedCharacters < this.options.playerParty.length) {
            this.rewardSelector = this.game.add.existing(new LevelRewardSelector(this.game, this.options.playerParty[this.processedCharacters], this.background.scale.x));
            this.rewardSelector.onSelected.add(this.showNextCharacterRewardSelector, this);
            this.processedCharacters++;
        } else {
            this.showContinueButton();
        }

    };

    return BattleVictory;
});