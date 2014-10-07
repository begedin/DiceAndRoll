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
            if (game.utils.settings.sound.musicVolume > 0) {
                if (this.music) {
                    // music is already been there, and start playing if stopped
                    if (!this.music.isPlaying) {
                        music = this.music.play('', 0, 0, true);
                    } else music = this.music;
                } else {
                    // introductory fade in of theme music
                    game.sound.stopAll();
                    this.music = game.add.audio('theme');
                    music = this.music.play('', 0, 0, true);
                }
            }

            // set screen background
            game.utils.stretchAndFitImage('menu');

            //#region common methods

            game.utils.setImage = function (area, image) {
                var asset = game.add.sprite(area.x, area.y, image);
                var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                asset.scale.setTo(ratio, ratio);
                return asset;
            };

            game.utils.createTextButton = function (text, x, y, style, sound, action) {
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

            game.utils.styles = {};
            game.utils.styles.normal = { font: '16px ' + game.utils.fontFamily, align: 'center'};
            game.utils.styles.emphasized = { font: '18px ' + game.utils.fontFamily, strokeThickness: 1 };
            game.utils.styles.small = { font: '14px ' + game.utils.fontFamily };
            game.utils.styles.menuButton = { font: '72px ' + game.utils.fontFamily, fill: '#990000', align: 'center' };
            game.utils.styles.menuButtonPressed = { font: '64px ' + game.utils.fontFamily, fill: '#FF6A00', align: 'center' };
            game.utils.styles.backButton = { font: '48px ' + game.utils.fontFamily, fill: '#DDDD00', align: 'center' };
            game.utils.styles.header = { font: '24px ' + game.utils.fontFamily, strokeThickness: 1 };
            game.utils.styles.healthBar = { font: '45px ' + game.utils.fontFamily, fill: '#009900', align: 'center' };
            game.utils.styles.characterSelectionContent = { font: '16px ' + game.utils.fontFamily, align: 'center', wordWrap: true, wordWrapWidth: 240 };

            //#endregion

            // build up the main menu options

            var addMenuItem = function (text, position, style, sound, action) {
                var item = game.add.text(game.width / 2 + 20, 225 + position * 70, text, style);
                item.anchor.setTo(0.5, 0.5);
                if (action) item.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

                item.inputEnabled = true;
                item.events.onInputDown.add(function (source, cursor) {
                    if (sound) sound.play('', 0, game.utils.settings.sound.sfxVolume);
                    if (action) source.setStyle(game.utils.styles.menuButtonPressed);
                });
                item.events.onInputUp.add(function (source, cursor) {
                    if (action) source.setStyle(game.utils.styles.menuButton);
                    if (action) action.call();
                });
                return item;
            };

            var sound = game.add.audio('sword');
            var sound2 = game.add.audio('sword2');

            var menu = game.add.group();
            menu.add(addMenuItem('New Game', 1, game.utils.styles.menuButton, sound, function () { game.state.start('Preloader', true, false, 'New', { persistMusic: true }); }));
            menu.add(addMenuItem('Continue', 2, game.utils.styles.menuButton, sound, function () { game.state.start('Preloader', true, false, 'Play', { persistMusic: false }); }));
            menu.add(addMenuItem('Settings', 3, game.utils.styles.menuButton, sound, function () { displaySettings(); }));
            menu.add(addMenuItem('Credits', 4, game.utils.styles.menuButton, sound, function () { displayCredits(); }));
            menu.add(addMenuItem('Test battle', 5, game.utils.styles.menuButton, sound, function () { game.state.start('Preloader', true, false, 'Battle', { persistMusic: false }); }));

            // there are two sub-menus present: settings and credits

            var displaySettings = function () {
                menu.visible = false;

                var submenuStyle = { font: '32px ' + game.utils.fontFamily, fill: '#FF6A00', align: 'center' };
                var volumeStyle = { font: '32px ' + game.utils.fontFamily, fill: '#990000', align: 'center' };

                var settings = game.add.group();

                settings.add(addMenuItem('Game settings', 1, game.utils.styles.header));

                var displayVolume = function(volume) {
                    if (volume == 0) {
                        return 'off';
                    } else if (volume == 1) {
                        return 'max';
                    } else {
                        return volume * 100;
                    }
                };

                settings.add(addMenuItem('Music volume', 1.8, submenuStyle));
                var lessMusic = game.add.sprite(460, 370, 'less');
                lessMusic.scale.setTo(0.8, 0.8);
                lessMusic.inputEnabled = true;
                lessMusic.events.onInputDown.add(function (source, cursor) {
                    source.frame = 1;
                    if (game.utils.settings.sound.musicVolume > 0) {
                        game.utils.settings.sound.musicVolume = Math.round((game.utils.settings.sound.musicVolume - 0.1) * 10) / 10;
                        musicLevel.text = displayVolume(game.utils.settings.sound.musicVolume);
                        music.volume = game.utils.settings.sound.musicVolume;
                    }
                });
                lessMusic.events.onInputUp.add(function (source, cursor) {
                    source.frame = 0;
                });
                settings.add(lessMusic);
                var moreMusic = game.add.sprite(700, 370, 'more');
                moreMusic.scale.setTo(0.8, 0.8);
                moreMusic.inputEnabled = true;
                moreMusic.events.onInputDown.add(function (source, cursor) {
                    source.frame = 1;
                    if (game.utils.settings.sound.musicVolume < 1) {
                        game.utils.settings.sound.musicVolume = Math.round((game.utils.settings.sound.musicVolume + 0.1) * 10) / 10;
                        musicLevel.text = displayVolume(game.utils.settings.sound.musicVolume);
                        music.volume = game.utils.settings.sound.musicVolume;
                    }
                });
                moreMusic.events.onInputUp.add(function (source, cursor) {
                    source.frame = 0;
                });
                settings.add(moreMusic);
                var musicLevel = addMenuItem('', 2.5, volumeStyle);
                musicLevel.text = displayVolume(game.utils.settings.sound.musicVolume);
                settings.add(musicLevel);

                settings.add(addMenuItem('Sound FX volume', 3.2, submenuStyle));
                var lessSfx = game.add.sprite(460, 470, 'less');
                lessSfx.scale.setTo(0.8, 0.8);
                lessSfx.inputEnabled = true;
                lessSfx.events.onInputDown.add(function (source, cursor) {
                    source.frame = 1;
                    if (game.utils.settings.sound.sfxVolume > 0) {
                        game.utils.settings.sound.sfxVolume = Math.round((game.utils.settings.sound.sfxVolume - 0.1) * 10) / 10;
                        sfxLevel.text = displayVolume(game.utils.settings.sound.sfxVolume);
                    }
                });
                lessSfx.events.onInputUp.add(function (source, cursor) {
                    source.frame = 0;
                });
                settings.add(lessSfx);
                var moreSfx = game.add.sprite(700, 470, 'more');
                moreSfx.scale.setTo(0.8, 0.8);
                moreSfx.inputEnabled = true;
                moreSfx.events.onInputDown.add(function (source, cursor) {
                    source.frame = 1;
                    if (game.utils.settings.sound.sfxVolume < 1) {
                        game.utils.settings.sound.sfxVolume = Math.round((game.utils.settings.sound.sfxVolume + 0.1) * 10) / 10;
                        sfxLevel.text = displayVolume(game.utils.settings.sound.sfxVolume);
                    }
                });
                moreSfx.events.onInputUp.add(function (source, cursor) {
                    source.frame = 0;
                });
                settings.add(moreSfx);
                var sfxLevel = addMenuItem('', 3.9, volumeStyle);
                sfxLevel.text = displayVolume(game.utils.settings.sound.sfxVolume);
                settings.add(sfxLevel);

                // construct sliders

                settings.add(addMenuItem('Back', 5, game.utils.styles.backButton, sound2, function () {
                    // set volume levels
                    settings.visible = false;
                    menu.visible = true;
                }));
            };

            var displayCredits = function () {
                menu.visible = false;

                var authorStyle = { font: '32px ' + game.utils.fontFamily, fill: '#FF6A00', align: 'center' };

                var credits = game.add.group();
                credits.add(addMenuItem('Game programming:', 1, game.utils.styles.header));
                credits.add(addMenuItem('Nikola Begedin', 1.5, authorStyle));
                credits.add(addMenuItem('Ratko Cosic', 2, authorStyle));
                credits.add(addMenuItem('Game artwork:', 2.5, game.utils.styles.header));
                credits.add(addMenuItem('Tvrtko Cosic', 3, authorStyle));
                credits.add(addMenuItem('Special thanks to:', 3.5, game.utils.styles.header));
                credits.add(addMenuItem('Looperman for music tracks', 4, { font: '24px ' + game.utils.fontFamily, strokeThickness: 1, fill: '#990000' }));
                credits.add(addMenuItem('Back', 5, game.utils.styles.backButton, sound2, function () { credits.visible = false; menu.visible = true; }));
            };


            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();
        },
        update: function () {
            if (this.music.volume < game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }
        }
    };

    return Menu
});