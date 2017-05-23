/*globals define*/

// preloader.js
// This javascript file represents phaser state for main menu.

/// <reference path="/scripts/vendor/phaser.js" />

define(['Phaser'], function (Phaser) {
    'use strict';

    var AUTHOR_STYLE = { font: '32px Berkshire Swash', fill: '#FF6A00', align: 'center' },
        MENU_BUTTON_STYLE = { font: '72px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        SUBMENU_BUTTON_STYLE = { font: '48px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        MENU_BUTTON_PRESSED_STYLE = { font: '56px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };

    var Menu = function (game) {
        this.game = game;
    };

    Menu.prototype = {
        preload: function () {
            this.loadGameData();
        },
        create: function () {

            var music;
            // check if music is enabled
            if (this.game.utils.settings.sound.musicVolume > 0) {
                if (this.music) {
                    // music is already been there, and start playing if stopped
                    if (!this.music.isPlaying) {
                        music = this.music.play('', 0, 0, true);
                    } else {
                        music = this.music;
                    } 
                } else {
                    // introductory fade in of theme music
                    this.game.sound.stopAll();
                    this.music = this.game.add.audio('theme');
                    music = this.music.play('', 0, 0, true);

                    // hack looping sound
                    this.music.onLoop.add(function() {
                        this.music.play('', 0, this.game.utils.settings.sound.musicVolume, true);
                    }, this);
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

            this.game.utils.createTextButton = function (game, text, x, y, style, soundset, action) {
                var item = game.add.text(x, y, text, style);
                item.anchor.setTo(0.5, 0.5);

                item.inputEnabled = true;
                item.events.onInputDown.add(function (source, cursor) {
                    if (soundset) soundset.play();
                    source.setStyle({ font: style.font, fill: '#DDDD00', align: style.align });
                });
                item.events.onInputUp.add(function (source, cursor) {
                    source.setStyle({ font: style.font, fill: '#FF6A00', align: style.align });
                    if (action) action.call();
                });
                return item;
            };

            var utils = this.game.utils;
            var game = this.game;
            utils.soundsets = {};
            utils.createSoundset = function (key, sounds) {
                var Sound = function (key, sounds) {
                    var self = this;
                    self.key = key;

                    self.sounds = [];
                    sounds.forEach(function(sound) {
                        self.sounds.push(game.add.audio(sound));
                    }, self);

                    self.play = function () {
                        var randomSound = self.sounds[game.rnd.integerInRange(0, self.sounds.length - 1)];
                        randomSound.play('', 0, utils.settings.sound.sfxVolume);
                    };
                };
                utils.soundsets[key] = new Sound(key, sounds);
            };

            // create all soundsets for the game
            utils.createSoundset('sword', ['sword', 'sword2', 'sword3', 'sword4', 'sword5']);
            utils.createSoundset('page', ['page', 'page2', 'page3', 'page4']);
            utils.createSoundset('select', ['swords']);
            utils.createSoundset('swing', ['swing', 'swing2', 'swing3', 'swoosh']);

            //#endregion

            //#region add styles

            this.game.utils.styles = {};
            this.game.utils.styles.normal = { font: '16px ' + this.game.utils.fontFamily, align: 'center' };
            this.game.utils.styles.emphasized = { font: '18px ' + this.game.utils.fontFamily, strokeThickness: 1 };
            this.game.utils.styles.small = { font: '14px ' + this.game.utils.fontFamily };
            this.game.utils.styles.backButton = { font: '56px ' + this.game.utils.fontFamily, fill: '#DDDD00', align: 'center', stroke: '#000000', strokeThickness: 2 };
            this.game.utils.styles.header = { font: '24px ' + this.game.utils.fontFamily, strokeThickness: 1 };
            this.game.utils.styles.characterSelectionContent = { font: '16px ' + this.game.utils.fontFamily, align: 'center', wordWrap: true, wordWrapWidth: 240 };

            //#endregion

            this.createMain();
            this.createSkirmish();
            this.createCredits();
            this.createTests();
            this.createSettings();

            this.showMain();

            this.load.onFileStart.removeAll();
            this.load.onFileComplete.removeAll();
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            } 
        }
    };

    Menu.prototype.createMenuItem = function (text, position, style, soundset, action) {
        style = style || MENU_BUTTON_PRESSED_STYLE;

        var item = this.game.add.text(this.game.width / 2 + 40, 225 + position * 70, text, style);
        item.anchor.setTo(0.5, 0.5);

        item.inputEnabled = true;
        item.events.onInputDown.add(function (source, cursor) {
            if (soundset) soundset.play();
            if (action) source.setStyle(MENU_BUTTON_PRESSED_STYLE);
        }, this);
        item.events.onInputUp.add(function (source, cursor) {
            if (action) source.setStyle(style);
            if (action) action.call();
        }, this);
        return item;
    };

    Menu.prototype.createMain = function () {
        this.mainMenu = this.game.add.group();

        var position = 1;

        this.mainMenu.add(this.createMenuItem('New Game', position++, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.newGame.bind(this)));
        if (this.game.saveData) this.mainMenu.add(this.createMenuItem('Continue', position++, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.continueGame.bind(this)));
        this.mainMenu.add(this.createMenuItem('Skirmish', position++, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.showSkirmish.bind(this)));
        this.mainMenu.add(this.createMenuItem('Settings', position++, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.showSettings.bind(this)));
        this.mainMenu.add(this.createMenuItem('Credits', position++, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.showCredits.bind(this)));
        //this.mainMenu.add(this.createMenuItem('Tests', position, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.showTests.bind(this)));

        this.mainMenu.visible = false;
    };

    Menu.prototype.showMain = function () {
        this.mainMenu.visible = true;
        this.skirmishMenu.visible = false;
        this.creditsMenu.visible = false;
        this.settingsMenu.visible = false;
        this.testsMenu.visible = false;
    };

    Menu.prototype.createSkirmish = function () {

        this.skirmishMenu = this.game.add.group();

        var mockupPlayers = [
            this.game.assets.characters.warrior,
            this.game.assets.characters.cleric,
            this.game.assets.characters.ranger,
            this.game.assets.characters.beast,
            this.game.assets.characters.alchemist,
            this.game.assets.characters.paladin
        ];

        mockupPlayers.forEach(function (character) { character.specialsUsed = 4; });

        this.skirmishMenu.add(this.createMenuItem('Brightwood forest', 1, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'grass', skirmish: true,
                playerParty: [ this.game.assets.characters.warrior, this.game.assets.characters.cleric, this.game.assets.characters.ranger ],
                enemyParty: [{ name: 'goblin_warrior', type: 'MELEE' }, { name: 'goblin_berserker', type: 'MELEE' }, { name: 'goblin_shaman', type: 'RANGED' } ]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Dead End, Very Dead', 1.7, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'dirt', skirmish: true,
                playerParty: [ this.game.assets.characters.beast, this.game.assets.characters.alchemist, this.game.assets.characters.paladin ],
                enemyParty: [{ name: 'monstrous_spider', type: 'MELEE' }, { name: 'giant_bird', type: 'MELEE' }, { name: 'monstrous_spider', type: 'MELEE' }]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Narrow Side', 2.4, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'dirt', skirmish: true,
                playerParty: [this.game.assets.characters.cleric, this.game.assets.characters.alchemist],
                enemyParty: [{ name: 'gnoll', type: 'MELEE' }, { name: 'gnoll', type: 'MELEE' } ]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Entrance to the Keep', 3.1, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'siege', skirmish: true,
                playerParty: mockupPlayers,
                enemyParty: [{ name: 'goblin_king', type: 'MELEE' }, { name: 'goblin_berserker', type: 'MELEE' }, { name: 'goblin_berserker', type: 'MELEE' }, { name: 'goblin_warrior', type: 'MELEE' }, { name: 'goblin_shaman', type: 'RANGED' }]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Lovely bones', 3.8, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'dirt', skirmish: true,
                playerParty: [this.game.assets.characters.warrior, this.game.assets.characters.cleric, this.game.assets.characters.beast],
                enemyParty: [{ name: 'skeleton_warrior', type: 'MELEE' }, { name: 'skeleton_archer', type: 'RANGED' }, { name: 'skeleton_warrior', type: 'MELEE' }]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Paladins tomb', 4.5, SUBMENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', {
                persistMusic: false, terrain: 'grass', skirmish: true,
                playerParty: mockupPlayers,
                enemyParty: [{ name: 'skeleton_archer', type: 'RANGED' }, { name: 'zombie', type: 'MELEE' }, { name: 'skeleton_archer', type: 'RANGED' }, { name: 'skeleton_warrior', type: 'MELEE' }, { name: 'lich_king', type: 'MELEE' }]
            });
        }.bind(this)));

        this.skirmishMenu.add(this.createMenuItem('Back', 5.2, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, this.hideSkirmish.bind(this)));

        this.skirmishMenu.visible = false;
    };

    Menu.prototype.showSkirmish = function () {
        this.mainMenu.visible = false;
        this.skirmishMenu.visible = true;
    };

    Menu.prototype.hideSkirmish = function () {
        this.skirmishMenu.visible = false;
        this.mainMenu.visible = true;
    };

    Menu.prototype.createSettings = function () {
        var submenuStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };
        var volumeStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center' };

        this.settingsMenu = this.game.add.group();

        this.settingsMenu.add(this.createMenuItem('Game settings', 1, this.game.utils.styles.header));

        var displayVolume = function (volume) {
            if (volume === 0) {
                return 'off';
            } else if (volume === 1) {
                return 'max';
            } else {
                return volume * 100;
            }
        };

        this.settingsMenu.add(this.createMenuItem('Music volume', 1.8, submenuStyle));
        var lessMusic = this.game.add.sprite(460, 360, 'arrows', 0);
        lessMusic.inputEnabled = true;
        lessMusic.events.onInputDown.add(function (source, cursor) {
            if (this.game.utils.settings.sound.musicVolume > 0) {
                this.game.utils.settings.sound.musicVolume = Math.round((this.game.utils.settings.sound.musicVolume - 0.1) * 10) / 10;
                musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
                this.music.volume = this.game.utils.settings.sound.musicVolume;
            }
        }, this);
        this.settingsMenu.add(lessMusic);
        var moreMusic = this.game.add.sprite(700, 360, 'arrows', 1);
        moreMusic.inputEnabled = true;
        moreMusic.events.onInputDown.add(function (source, cursor) {
            if (this.game.utils.settings.sound.musicVolume < 1) {
                this.game.utils.settings.sound.musicVolume = Math.round((this.game.utils.settings.sound.musicVolume + 0.1) * 10) / 10;
                musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
                this.music.volume = this.game.utils.settings.sound.musicVolume;
            }
        }, this);
        this.settingsMenu.add(moreMusic);
        var musicLevel = this.createMenuItem('', 2.4, volumeStyle);
        musicLevel.text = displayVolume(this.game.utils.settings.sound.musicVolume);
        this.settingsMenu.add(musicLevel);

        this.settingsMenu.add(this.createMenuItem('Sound FX volume', 3.2, submenuStyle));
        var lessSfx = this.game.add.sprite(460, 470, 'arrows', 0);
        lessSfx.inputEnabled = true;
        lessSfx.events.onInputDown.add(function (source, cursor) {
            if (this.game.utils.settings.sound.sfxVolume > 0) {
                this.game.utils.settings.sound.sfxVolume = Math.round((this.game.utils.settings.sound.sfxVolume - 0.1) * 10) / 10;
                sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
            }
        }, this);
        this.settingsMenu.add(lessSfx);
        var moreSfx = this.game.add.sprite(700, 470, 'arrows', 1);
        moreSfx.inputEnabled = true;
        moreSfx.events.onInputDown.add(function (source, cursor) {
            if (this.game.utils.settings.sound.sfxVolume < 1) {
                this.game.utils.settings.sound.sfxVolume = Math.round((this.game.utils.settings.sound.sfxVolume + 0.1) * 10) / 10;
                sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
            }
        }, this);
        this.settingsMenu.add(moreSfx);
        var sfxLevel = this.createMenuItem('', 3.9, volumeStyle);
        sfxLevel.text = displayVolume(this.game.utils.settings.sound.sfxVolume);
        this.settingsMenu.add(sfxLevel);

        this.settingsMenu.add(this.createMenuItem('Back', 5, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, this.hideSettings.bind(this)));

        this.settingsMenu.visible = false;
    };

    Menu.prototype.showSettings = function () {
        this.mainMenu.visible = false;
        this.settingsMenu.visible = true;
    };

    Menu.prototype.hideSettings = function () {
        this.settingsMenu.visible = false;
        this.mainMenu.visible = true;

        this.game.store.set('settings', {
            sfxVolume: this.game.utils.settings.sound.sfxVolume,
            musicVolume: this.game.utils.settings.sound.musicVolume
        });
    };

    Menu.prototype.createCredits = function () {
        this.creditsMenu = this.game.add.group();
        this.creditsMenu.add(this.createMenuItem('Game programming:', 1, this.game.utils.styles.header));
        this.creditsMenu.add(this.createMenuItem('Nikola Begedin', 1.5, AUTHOR_STYLE));
        this.creditsMenu.add(this.createMenuItem('Ratko Cosic', 2, AUTHOR_STYLE));
        this.creditsMenu.add(this.createMenuItem('Game artwork:', 2.5, this.game.utils.styles.header));
        this.creditsMenu.add(this.createMenuItem('Tvrtko Cosic', 3, AUTHOR_STYLE));
        this.creditsMenu.add(this.createMenuItem('Special thanks to:', 3.5, this.game.utils.styles.header));
        this.creditsMenu.add(this.createMenuItem('Looperman for music tracks', 4, { font: '24px ' + this.game.utils.fontFamily, strokeThickness: 1, fill: '#990000' }));
        this.creditsMenu.add(this.createMenuItem('Back', 5, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, this.hideCredits.bind(this)));

        this.creditsMenu.visible = false;
    };

    Menu.prototype.showCredits = function () {
        this.mainMenu.visible = false;
        this.creditsMenu.visible = true;
    };

    Menu.prototype.hideCredits = function () {
        this.creditsMenu.visible = false;
        this.mainMenu.visible = true;
    };

    Menu.prototype.createTests = function () {
        this.testsMenu = this.game.add.group();

        var mockupPlayers = [
            this.game.assets.characters.warrior,
            this.game.assets.characters.cleric,
            this.game.assets.characters.ranger,
            this.game.assets.characters.beast,
            this.game.assets.characters.alchemist,
            this.game.assets.characters.paladin
        ];

        mockupPlayers.forEach(function (character) { character.specialsUsed = 4; });

        var mockupMonsters = [{ name: 'goblin_warrior', type: 'MELEE' }, { name: 'goblin_berserker', type: 'MELEE' },
                    { name: 'goblin_shaman', type: 'RANGED' }, { name: 'monstrous_spider', type: 'MELEE' },
                    { name: 'gnoll', type: 'MELEE' }, { name: 'giant_bird', type: 'MELEE' }];

        this.testsMenu.add(this.createMenuItem('Test campaign', 1, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Play', { persistMusic: false, campaign: this.game.assets.campaigns[0], playerParty: mockupPlayers });
        }.bind(this)));

        this.testsMenu.add(this.createMenuItem('Test battle', 2, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'Battle', { persistMusic: false, terrain: 'grass', playerParty: mockupPlayers, enemyParty: mockupMonsters });
        }.bind(this)));

        this.testsMenu.add(this.createMenuItem('Erase save data', 3, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, this.deleteGameData.bind(this)));

        this.testsMenu.add(this.createMenuItem('Test Victory', 4, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'BattleVictory', { persistMusic: false, playerParty: mockupPlayers, combatResult: 'VICTORY' });
        }.bind(this)));

        this.testsMenu.add(this.createMenuItem('Test Defeat', 5, MENU_BUTTON_STYLE, this.game.utils.soundsets.sword, function () {
            this.game.state.start('Preloader', true, false, 'BattleDefeat', { persistMusic: false, playerParty: mockupPlayers, combatResult: 'DEFEAT' });
        }.bind(this)));

        this.testsMenu.add(this.createMenuItem('Back', 6, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, this.hideTests.bind(this)));

        this.testsMenu.visible = false;
    };

    Menu.prototype.showTests = function () {
        this.mainMenu.visible = false;
        this.testsMenu.visible = true;
    };

    Menu.prototype.hideTests = function () {
        this.testsMenu.visible = false;
        this.mainMenu.visible = true;
    };

    Menu.prototype.newGame = function () {
        this.game.state.start('Preloader', true, false, 'New',{ persistMusic: true });
    };

    Menu.prototype.continueGame = function () {

        var state = this.game.saveData;

        if (!state) return;

        var options = {
            persistMusic: false,
            loadState: true,
            playState: state.playState,
            playerParty: state.partyState
        };

        this.game.assets.campaigns.forEach(function (campaign) {
            if (campaign.name === state.playState.campaignId) {
                options.campaign = campaign;
                return;
            }
        });

        this.game.state.start('Preloader', true, false, 'Play', options);
    };

    Menu.prototype.loadGameData = function () {
        this.game.saveData = this.game.store.get('saveData');
    };

    Menu.prototype.deleteGameData = function () {
        this.game.store.remove('saveData');
        delete this.game.saveData;

        // rebuild main menu

        this.mainMenu.destroy(true);
        this.createMain();
    };

    return Menu;
});