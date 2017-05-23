/*globals define*/

define([
    'Phaser',
    'inc/entities/map',
    'inc/entities/pinpoint'
], function (Phaser, Map, Pinpoint) {
    'use strict';
    var Play = function (game) {
        this.game = game;
    };

    Play.prototype = {
        init: function (options) {
            this.options = options;
        },
        preload: function () {
        },
        create: function () {

            // introductory fade in of play music
            if (this.game.utils.settings.sound.musicVolume > 0) {
                this.game.sound.stopAll();
                this.music = this.game.add.audio('play');
                this.music.play('', 0, 0, true);

                // hack looping sound
                this.music.onLoop.add(function() {
                    this.music.play('', 0, this.game.utils.settings.sound.musicVolume, true);
                }, this);                
            }

            if (this.options.playState) {
                this.map = this.game.add.existing(new Map(this.game, this.options.campaign.maps[this.options.playState.currentMapIndex].map, this.options.playState.mapData));
                this.options.currentMapIndex = this.options.playState.currentMapIndex;
            } else {
                this.map = this.game.add.existing(new Map(this.game, this.options.campaign.maps[this.options.currentMapIndex].map));
            }

            this.locationArea = new Phaser.Rectangle(26, 200, 290, 430);
            this.locationBackground = this.game.add.sprite(this.locationArea.left, this.locationArea.top, 'empty');
            this.locationBackground.width = this.locationArea.width;
            this.locationBackground.height = this.locationArea.height;

            var titleStyle = { font: '24px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100, stroke: '#000000', strokeThickness: 1 },
                descriptionStyle = { font: '16px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 },
                buttonStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#996600', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100, stroke: '#000000', strokeThickness: 2 };

            this.locationInfo = {};
            this.locationInfo.group = this.game.add.group();
            this.locationInfo.group.position.set(this.locationArea.left, this.locationArea.top);

            this.locationInfo.title = this.game.add.text(this.locationArea.width / 2, 50, "Welcome!", titleStyle, this.locationInfo.group);
            this.locationInfo.title.anchor.setTo(0.5, 0);

            this.locationInfo.description = this.game.add.text(this.locationArea.width / 2, 120, "Please select a location on the map", descriptionStyle, this.locationInfo.group);
            this.locationInfo.description.anchor.setTo(0.5, 0);

            this.locationInfo.button = this.game.add.text(this.locationArea.width / 2, 160, "None", buttonStyle, this.locationInfo.group);
            this.locationInfo.button.anchor.setTo(0.5, 0);
            this.locationInfo.button.inputEnabled = true;
            this.locationInfo.button.visible = false;

            this.initializePinpoints();

            this.game.utils.stretchAndFitImage(this.game, 'play');

            // add back button
            this.game.utils.createTextButton(this.game, 'Quit game', 150, this.game.height - 50, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, function () {
                if (this.game.utils.settings.sound.musicVolume > 0) this.game.sound.stopAll();
                this.game.state.start('Menu', true, false);
            }.bind(this));
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }

            this.pinpoints.position.set(this.map.x, this.map.y);

            if (this.mapWon) this.game.state.start('Preloader', true, false, 'MapVictory', this.options);
        }
    };

    Play.prototype.onNewPinpointInfo = function (pinpoint, data) {
        this.unsetPinpoints(pinpoint);
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.visible = false;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 160);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Investigate");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(pinpoint.explore, pinpoint);
        this.currentPinpointId = data.identifier;
        this.saveState();
    };

    Play.prototype.onKnownPinpointInfo = function (pinpoint, data) {
        this.unsetPinpoints(pinpoint);
        switch (data.type) {
            case "EMPTY": this.setPinpointEmpty(pinpoint);
                break;
            case "ENCOUNTER": this.setPinpointEncounter(pinpoint);
                break;
            case "TREASURE": this.setPinpointTreasure(pinpoint);
                break;
            case "SHOP": this.setPinpointShop(pinpoint);
                break;
            case "CAMP": this.setPinpointCamp(pinpoint);
                break;
        }
        this.currentPinpointId = data.identifier;
    };

    Play.prototype.onClearedPinpointInfo = function (pinpoint, pinpointData) {
        this.unsetPinpoints(pinpoint);
        this.locationInfo.title.setText(pinpoint.data.name);
        this.game.utils.soundsets.page.play();
        this.locationInfo.button.visible = false;
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.visible = false;
        this.currentPinpointId = pinpoint.data.identifier;
        this.saveState();
        this.mapWon = pinpointData.isFinal === true;
    };

    Play.prototype.setPinpointEmpty = function (pinpoint) {
        this.unsetPinpoints(pinpoint);
        this.locationInfo.title.setText(pinpoint.data.name);
        this.game.utils.soundsets.page.play();
        this.locationInfo.button.visible = false;
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Continue");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(pinpoint.clear, pinpoint);
        this.saveState();
    };

    Play.prototype.setPinpointEncounter = function (pinpoint) {
        this.locationInfo.title.setText(pinpoint.data.name);
        this.game.utils.soundsets.page.play();
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.setText("Fight!");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(this.startCombat.bind(this, pinpoint));
        this.saveState();
    };

    Play.prototype.setPinpointShop = function (pinpoint) {
        this.locationInfo.title.setText(pinpoint.data.name);
        this.game.utils.soundsets.page.play();
        this.locationInfo.button.visible = false;
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.description.visible = true;

        // not supported yet, so auto-clears
        pinpoint.clear();
        this.saveState();
    };

    Play.prototype.setPinpointCamp = function (pinpoint) {
        this.locationInfo.title.setText(pinpoint.data.name);
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        //this.locationInfo.button.visible = true;
        //this.locationInfo.button.setText("Camp");
        //this.locationInfo.button.events.onInputDown.removeAll();
        //this.locationInfo.button.events.onInputDown.add(this.startCamping.bind(this, data));

        // not supported yet, so auto-clears
        pinpoint.clear();
        this.saveState();
    };

    Play.prototype.setPinpointTreasure = function (pinpoint) {
        this.locationInfo.title.setText(pinpoint.data.name);
        this.locationInfo.description.visible = false;
        this.game.utils.soundsets.page.play();
        this.locationInfo.description.setText(pinpoint.data.description);
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Loot!");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(this.startLooting.bind(this, pinpoint));

        this.saveState();
    };

    Play.prototype.startCombat = function (pinpoint) {
        
        this.game.utils.soundsets.page.play();

        this.options.persistMusic = false;
        this.options.terrain = pinpoint.data.encounter.terrain;

        this.options.enemyParty = [];
        pinpoint.data.encounter.monsters.forEach(function (monster) {
            this.options.enemyParty.push(this.game.assets.monsters[monster]);
        }, this);

        this.options.playState = {
            activePinpointId: pinpoint.data.identifier,
            campaignId: this.options.campaign.name,
            currentMapIndex: this.options.currentMapIndex,
            mapData: {
                pinpoints: this.serializePinpoints()
            }
        };

        this.saveState();

        this.game.state.start('Preloader', true, false, 'Battle', this.options);
    };

    Play.prototype.startCamping = function (data) {

        this.game.add.audio('horn').play('', 0, this.game.utils.settings.sound.sfxVolume);

        //self.game.state.start('Preloader', true, false, 'Camp', this.options);
    };

    Play.prototype.startLooting = function (pinpoint) {

        this.game.add.audio('coins').play('', 0, this.game.utils.settings.sound.sfxVolume);
        pinpoint.clear();
        //self.game.state.start('Preloader', true, false, 'Loot', this.options);
    };

    Play.prototype.initializePinpoints = function () {
        this.pinpoints = this.game.add.group();
        for (var index in this.map.data.pinpoints) {
            var data = this.map.data.pinpoints[index];
            var pinpoint = this.pinpoints.add(new Pinpoint(this.game, this.map, data));
            pinpoint.events.onNewPinpointInfo.add(this.onNewPinpointInfo, this);
            pinpoint.events.onKnownPinpointInfo.add(this.onKnownPinpointInfo, this);
            pinpoint.events.onClearedPinpointInfo.add(this.onClearedPinpointInfo, this);
        }

        if (this.options.playState) {
            this.pinpoints.forEach(function (pinpoint) {
                if (this.options.playState.activePinpointId === pinpoint.data.identifier) {
                    if (this.options.combatResult === 'VICTORY') pinpoint.clear();
                }
            }, this);
        }
        else {
            this.pinpoints.getAt(0).setCurrent();
        }

        this.setNeighbors();

        this.saveState();
    };

    Play.prototype.setNeighbors = function () {
        this.pinpoints.forEach(function (pinpoint) {
            var neighbors = [];

            this.pinpoints.forEach(function (potentialNeighbor) {
                if (pinpoint.data.connectsTo.indexOf(potentialNeighbor.data.identifier) > -1) {
                    neighbors.push(potentialNeighbor);
                }
            }, this);

            pinpoint.setNeighbors(neighbors);
        }, this);
    };

    Play.prototype.unsetPinpoints = function (currentPinpoint) {
        this.pinpoints.forEach(function (pinpoint) {
            if (currentPinpoint !== pinpoint) pinpoint.unsetCurrent();
        }, this);
    };

    Play.prototype.serializePinpoints = function () {
        var serialized = [];
        this.pinpoints.forEach(function (pinpoint) {
            serialized.push(pinpoint.serialize());
        }, this);

        return serialized;
    };

    Play.prototype.saveState = function () {
        var state = {};

        state.playState = {
            activePinpointId: this.currentPinpointId,
            campaignId: this.options.campaign.name,
            currentMapIndex: this.options.currentMapIndex,
            mapData: {
                pinpoints: this.serializePinpoints()
            }
        };

        state.partyState = this.options.playerParty;

        this.game.store.set('saveData', state);
    };

    return Play;
});