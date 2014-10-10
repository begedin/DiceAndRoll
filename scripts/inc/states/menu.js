// preloader.js
// This javascript file represents phaser state for main menu.

/// <reference path="/scripts/vendor/phaser.js" />

define(['Phaser'], function (Phaser) {
    'use strict';
    var Menu = function (game) {
        this.game = game;
    };

    Menu.prototype = {
        preload: function () {
        },
        create: function () {

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
                    this.music = this.game.add.audio('theme');
                    music = this.music.play('', 0, 0, true);
                }
            }

            // set screen background
            this.game.utils.stretchAndFitImage(this.game, 'menu');

            //#region common methods

            this.game.utils.setImage = function (game, area, image) {
                var asset = game.add.sprite(area.x, area.y, image);
                var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                asset.scale.setTo(ratio, ratio);
                return asset;
            };

            this.game.utils.createTextButton = function (game, text, x, y, style, sound, action) {
                var item = game.add.text(x, y, text, style);
                item.anchor.setTo(0.5, 0.5);
                item.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

                item.inputEnabled = true;
                item.events.onInputDown.add(function (source, cursor) {
                    if (sound) sound.play('', 0, game.utils.settings.sound.sfxVolume);
                    source.setStyle({ font: style.font, fill: '#DDDD00', align: style.align });
                });
                item.events.onInputUp.add(function (source, cursor) {
                    source.setStyle({ font: style.font, fill: '#FF6A00', align: style.align });
                    if (action) action.call();
                });
                return item;
            };

            //#endregion

            //#region add styles

            this.game.utils.styles = {};
            this.game.utils.styles.normal = { font: '16px ' + this.game.utils.fontFamily, align: 'center' };
            this.game.utils.styles.emphasized = { font: '18px ' + this.game.utils.fontFamily, strokeThickness: 1 };
            this.game.utils.styles.small = { font: '14px ' + this.game.utils.fontFamily };
            this.game.utils.styles.menuButton = { font: '72px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center' };
            this.game.utils.styles.menuButtonPressed = { font: '64px ' + this.game.utils.fontFamily, fill: '#FF6A00', align: 'center' };
            this.game.utils.styles.backButton = { font: '48px ' + this.game.utils.fontFamily, fill: '#DDDD00', align: 'center' };
            this.game.utils.styles.header = { font: '24px ' + this.game.utils.fontFamily, strokeThickness: 1 };
            this.game.utils.styles.healthBar = { font: '45px ' + this.game.utils.fontFamily, fill: '#009900', align: 'center' };
            this.game.utils.styles.characterSelectionContent = { font: '16px ' + this.game.utils.fontFamily, align: 'center', wordWrap: true, wordWrapWidth: 240 };

            //#endregion

            // build up the main menu options            

            var sound = this.game.add.audio('sword');
            var sound2 = this.game.add.audio('sword2');

            var mockupPlayers = [
                this.game.assets.characters.warrior,
                this.game.assets.characters.cleric,
                this.game.assets.characters.ranger,
                this.game.assets.characters.beast,
                this.game.assets.characters.alchemist,
                this.game.assets.characters.paladin
            ];

            var mockupMonsters = [{ name: 'goblin_warrior', type: 'MELEE' }, { name: 'goblin_berserker', type: 'MELEE' },
                        { name: 'goblin_shaman', type: 'RANGED' }, { name: 'monstrous_spider', type: 'MELEE' },
                        { name: 'gnoll', type: 'MELEE' }];

            this.mainMenu = this.game.add.group();
            this.mainMenu.add(this.createMenuItem('New Game', 1, this.game.utils.styles.menuButton, sound, function () {
                this.game.state.start('Preloader', true, false, 'New',
                    { persistMusic: true });
            }.bind(this)));
            this.mainMenu.add(this.createMenuItem('Continue', 2, this.game.utils.styles.menuButton, sound, function () {
                this.game.state.start('Preloader', true, false, 'Play',
                    { persistMusic: false, campaign: this.game.assets.campaigns[0], playerParty: mockupPlayers });
            }.bind(this)));
            this.mainMenu.add(this.createMenuItem('Settings', 3, this.game.utils.styles.menuButton, sound, this.displaySettings.bind(this)));
            this.mainMenu.add(this.createMenuItem('Credits', 4, this.game.utils.styles.menuButton, sound, this.displayCredits.bind(this)));
            this.mainMenu.add(this.createMenuItem('Test battle', 5, this.game.utils.styles.menuButton, sound, function () {
                this.game.state.start('Preloader', true, false, 'Battle',
                    { persistMusic: false, terrain: 'dirt', playerParty: mockupPlayers, enemyParty: mockupMonsters });
            }.bind(this)));

            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }
        }
    };

    Menu.prototype.createMenuItem = function (text, position, style, sound, action) {
        var item = this.game.add.text(this.game.width / 2 + 20, 225 + position * 70, text, style);
        item.anchor.setTo(0.5, 0.5);
        if (action) item.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        item.inputEnabled = true;
        item.events.onInputDown.add(function (source, cursor) {
            if (sound) sound.play('', 0, this.game.utils.settings.sound.sfxVolume);
            if (action) source.setStyle(this.game.utils.styles.menuButtonPressed);
        }, this);
        item.events.onInputUp.add(function (source, cursor) {
            if (action) source.setStyle(this.game.utils.styles.menuButton);
            if (action) action.call();
        }, this);
        return item;
    };

    Menu.prototype.displaySettings = function () {
        this.mainMenu.visible = false;

        var submenuStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#FF6A00', align: 'center' };
        var volumeStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center' };

        var settings = this.game.add.group();

        settings.add(this.createMenuItem('Game settings', 1, this.game.utils.styles.header));

        var displayVolume = function(volume) {
            if (volume === 0) {
                return 'off';
            } else if (volume === 1) {
                return 'max';
            } else {
                return volume * 100;
            }
        };

        settings.add(this.createMenuItem('Music volume', 1.8, submenuStyle));
        var lessMusic = this.game.add.sprite(460, 370, 'less');
        lessMusic.scale.setTo(0.8, 0.8);
        lessMusic.inputEnabled = true;
        lessMusic.events.onInputDown.add(function (source, cursor) {
            source.frame = 1;
            if (this.game.utils.settings.sound.musicVolume > 0) {
                this.game.utils.settings.sound.musicVolume = Math.round((this.game.utils.settings.sound.musicVolume - 0.1) * 10) / 10;
                musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
                this.music.volume = this.game.utils.settings.sound.musicVolume;
            }
        }, this);
        lessMusic.events.onInputUp.add(function (source, cursor) {
            source.frame = 0;
        }, this);
        settings.add(lessMusic);
        var moreMusic = this.game.add.sprite(700, 370, 'more');
        moreMusic.scale.setTo(0.8, 0.8);
        moreMusic.inputEnabled = true;
        moreMusic.events.onInputDown.add(function (source, cursor) {
            source.frame = 1;
            if (this.game.utils.settings.sound.musicVolume < 1) {
                this.game.utils.settings.sound.musicVolume = Math.round((this.game.utils.settings.sound.musicVolume + 0.1) * 10) / 10;
                musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
                this.music.volume = this.game.utils.settings.sound.musicVolume;
            }
        }, this);
        moreMusic.events.onInputUp.add(function (source, cursor) {
            source.frame = 0;
        }, this);
        settings.add(moreMusic);
        var musicLevel = this.createMenuItem('', 2.5, volumeStyle);
        musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
        settings.add(musicLevel);

        settings.add(this.createMenuItem('Sound FX volume', 3.2, submenuStyle));
        var lessSfx = this.game.add.sprite(460, 470, 'less');
        lessSfx.scale.setTo(0.8, 0.8);
        lessSfx.inputEnabled = true;
        lessSfx.events.onInputDown.add(function (source, cursor) {
            source.frame = 1;
            if (this.game.utils.settings.sound.sfxVolume > 0) {
                this.game.utils.settings.sound.sfxVolume = Math.round((this.game.utils.settings.sound.sfxVolume - 0.1) * 10) / 10;
                sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
            }
        }, this);
        lessSfx.events.onInputUp.add(function (source, cursor) {
            source.frame = 0;
        }, this);
        settings.add(lessSfx);
        var moreSfx = this.game.add.sprite(700, 470, 'more');
        moreSfx.scale.setTo(0.8, 0.8);
        moreSfx.inputEnabled = true;
        moreSfx.events.onInputDown.add(function (source, cursor) {
            source.frame = 1;
            if (this.game.utils.settings.sound.sfxVolume < 1) {
                this.game.utils.settings.sound.sfxVolume = Math.round((this.game.utils.settings.sound.sfxVolume + 0.1) * 10) / 10;
                sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
            }
        }, this);
        moreSfx.events.onInputUp.add(function (source, cursor) {
            source.frame = 0;
        }, this);
        settings.add(moreSfx);
        var sfxLevel = this.createMenuItem('', 3.9, volumeStyle);
        sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
        settings.add(sfxLevel);

        // construct sliders

        settings.add(this.createMenuItem('Back', 5, this.game.utils.styles.backButton, this.sound2, function () {
            // set volume levels
            settings.visible = false;
            this.mainMenu.visible = true;
        }.bind(this)));
    };

    Menu.prototype.displayCredits = function () {
        this.mainMenu.visible = false;

        var authorStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#FF6A00', align: 'center' };

        var credits = this.game.add.group();
        credits.add(this.createMenuItem('Game programming:', 1, this.game.utils.styles.header));
        credits.add(this.createMenuItem('Nikola Begedin', 1.5, authorStyle));
        credits.add(this.createMenuItem('Ratko Cosic', 2, authorStyle));
        credits.add(this.createMenuItem('Game artwork:', 2.5, this.game.utils.styles.header));
        credits.add(this.createMenuItem('Tvrtko Cosic', 3, authorStyle));
        credits.add(this.createMenuItem('Special thanks to:', 3.5, this.game.utils.styles.header));
        credits.add(this.createMenuItem('Looperman for music tracks', 4, { font: '24px ' + this.game.utils.fontFamily, strokeThickness: 1, fill: '#990000' }));
        credits.add(this.createMenuItem('Back', 5, this.game.utils.styles.backButton, this.sound2, function () { credits.visible = false; this.mainMenu.visible = true; }.bind(this)));
    };

    return Menu;
});