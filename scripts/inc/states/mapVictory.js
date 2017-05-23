define(['Phaser'], function (Phaser) {
    'use strict';

    var VICTORY_TITLE_STYLE = { font: '64px Berkshire Swash', fill: '#009900', align: 'center', wordWrap: true, wordWrapWidth: 550 },
        BUTTON_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        BUTTON_STYLE_PRESSED = { font: '36px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };

    var MapVictory = function (game) {
        this.game = game;
    };

    MapVictory.prototype = {};

    MapVictory.prototype.init = function (options) {
        this.options = options;

        this.campaignOver = (this.options.currentMapIndex === this.options.campaign.maps.length - 1);
    };

    MapVictory.prototype.create = function () {
        this.game.utils.stretchAndFitImage(this.game, 'mapVictory');

        this.titleText = this.game.add.text(this.game.width / 2, 300, 'Placeholder', VICTORY_TITLE_STYLE);
        this.titleText.anchor.setTo(0.5);

        this.continueButton = this.game.add.text(this.game.width / 2, 500, 'Placeholder', BUTTON_STYLE);
        this.continueButton.anchor.setTo(0.5, 0.5);
        this.continueButton.inputEnabled = true;

        // TODO: Add descriptions for campaign victory and map transitions?

        if (this.campaignOver) {
            this.titleText.setText("The campaign is over!");
            this.continueButton.setText("Exit");
            this.continueButton.events.onInputDown.add(this.exitToMenu, this);
        } else {
            this.titleText.setText("You have conquered this area!");
            this.continueButton.setText("Onwards!");
            this.continueButton.events.onInputDown.add(this.transitionToNextMap, this);
        }

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
                this.music = this.game.add.audio('mapVictory');
                music = this.music.play('', 0, 0, true);

                // hack looping sound
                this.music.onLoop.add(function() {
                    this.music.play('', 0, this.game.utils.settings.sound.musicVolume, true);
                }, this);               
            }
        }
    };

    MapVictory.prototype.update = function () {
        if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
            this.music.volume += 0.005;
        }
    };

    MapVictory.prototype.exitToMenu = function (source, event) {
        source.setStyle(BUTTON_STYLE_PRESSED);
        this.game.state.start('Preloader', true, false, 'Menu', this.options);
    };

    MapVictory.prototype.transitionToNextMap = function (source, event) {
        source.setStyle(BUTTON_STYLE_PRESSED);
        this.options.currentMapIndex++;
        this.game.state.start('Preloader', true, false, 'Play', this.options);
    };

    return MapVictory;
});