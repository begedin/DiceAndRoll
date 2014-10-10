var define = define || {};

/// currently unused, was the old level loader, without the combat

define([
    'Phaser',
    'inc/entities/map',
    'inc/entities/pinpoint'
], function (Phaser, Map, Pinpoint) {
    'use strict';
    var Play = function(game){
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
            }

            this.map = this.game.add.existing(new Map(this.game, this.options.campaign.maps[0].map));
            this.initializePinpoints();


            this.locationArea = new Phaser.Rectangle(26, 200, 290, 430);
            this.locationBackground = this.game.add.sprite(this.locationArea.left, this.locationArea.top, 'pixel_white');
            this.locationBackground.width = this.locationArea.width;
            this.locationBackground.height = this.locationArea.height;

            var titleStyle = { font: '24px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 },
                descriptionStyle = { font: '16px ' + this.game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 },
                buttonStyle = { font: '32px ' + this.game.utils.fontFamily, fill: '#996600', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 };

            this.locationInfo = {};
            this.locationInfo.group = this.game.add.group();
            this.locationInfo.group.position.set(this.locationArea.left, this.locationArea.top);

            this.locationInfo.title = this.game.add.text(this.locationArea.width / 2, 50, "Welcome!", titleStyle, this.locationInfo.group);
            this.locationInfo.title.anchor.setTo(0.5, 0);

            this.locationInfo.description = this.game.add.text(this.locationArea.width / 2, 120, "Please select a location on the map", descriptionStyle, this.locationInfo.group);
            this.locationInfo.description.anchor.setTo(0.5, 0);

            this.locationInfo.button = this.game.add.text(this.locationArea.width / 2, 160, "None", buttonStyle, this.locationInfo.group);
            this.locationInfo.button.anchor.setTo(0.5, 0);
            this.locationInfo.button.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            this.locationInfo.button.inputEnabled = true;
            this.locationInfo.button.visible = false;

            this.game.utils.stretchAndFitImage('play');

            // add back button
            this.game.utils.createTextButton('Quit game', 150, this.game.height - 50, this.game.utils.styles.backButton, this.game.add.audio('sword'), function () {
                if (this.game.utils.settings.sound.musicVolume > 0) this.game.sound.stopAll();
                this.game.state.start('Menu', true, false);
            });
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }

            this.pinpoints.position.set(this.map.x, this.map.y);

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
    };

    Play.prototype.onKnownPinpointInfo = function (pinpoint, data) {
        this.unsetPinpoints(pinpoint);
        switch (data.type) {
            case "EMPTY": this.setPinpointEmpty(pinpoint, data);
                break;
            case "ENCOUNTER": this.setPinpointEncounter(pinpoint, data);
                break;
            case "TREASURE": this.setPinpointTreasure(pinpoint, data);
                break;
            case "SHOP": this.setPinpointShop(pinpoint, data);
                break;
            case "CAMP": this.setPinpointCamp(pinpoint, data);
                break;
        }
    };

    Play.prototype.setPinpointEmpty = function (pinpoint, data) {
        this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
        this.locationInfo.button.visible = false;
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        pinpoint.clear();
    };

    Play.prototype.setPinpointEncounter = function (pinpoint, data) {
        this.locationInfo.title.setText(data.name);
        this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.setText("Fight!");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(this.startCombat.bind(this, data.encounter));
    };

    Play.prototype.setPinpointShop = function (pinpoint, data) {
        this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
        this.locationInfo.button.visible = false;
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        pinpoint.clear();
    };

    Play.prototype.setPinpointCamp = function (pinpoint, data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        //this.locationInfo.button.visible = true;
        //this.locationInfo.button.setText("Camp");
        //this.locationInfo.button.events.onInputDown.removeAll();
        //this.locationInfo.button.events.onInputDown.add(this.startShop.bind(this));

        pinpoint.clear();
    };

    Play.prototype.setPinpointTreasure = function (pinpoint, data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.visible = false;
        this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.setText("Loot!");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(this.startLooting, this);
    };

    Play.prototype.startCombat = function (encounter) {
        
        this.options.persistMusic = false;
        this.options.terrain = encounter.terrain;

        this.game.state.start('Preloader', true, false, 'Battle', this.options);
    };

    Play.prototype.initializePinpoints = function () {
        this.pinpoints = this.game.add.group();
        this.pinpoints.position.set(this.x, this.y);
        for (var index in this.map.data.pinpoints) {
            var data = this.map.data.pinpoints[index];
            var pinpoint = this.pinpoints.add(new Pinpoint(this.game, this.map, data));
            pinpoint.events.onVisitedInfo.add(this.onNewPinpointInfo, this);
            pinpoint.events.onInvestigatedInfo.add(this.onKnownPinpointInfo, this);
            pinpoint.events.onClearedInfo.add(this.onClearedPinpointInfo, this);
        }

        this.pinpoints.getAt(0).current = true;
        this.setNeighbors();
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
            if (currentPinpoint !== pinpoint) pinpoint.current = false;
        }, this);
    };

    Play.prototype.onClearedPinpointInfo = function (pinpoint, data) {
        this.unsetPinpoints(pinpoint);
        this.setPinpointEmpty(pinpoint, data);
    };

    return Play;
});