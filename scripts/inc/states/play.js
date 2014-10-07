var define = define || {};

/// currently unused, was the old level loader, without the combat

define(['Phaser'], function (Phaser) {
    'use strict';
    var Play = function(game){
    };

    Play.prototype = {
        init: function(options) {
            this.campaign = options.campaign;
            this.characters = options.characters;
        },
        preload: function () {
            this.mapID = "50DA3DC4-2C49-4C11-967F-882431C3D499";
        },
        create: function () {

            // introductory fade in of play music
            if (this.game.utils.settings.sound.musicVolume > 0) {
                this.game.sound.stopAll();
                this.music = this.game.add.audio('play');
                this.music.play('', 0, 0, true);
            }

            this.mapData = JSON.parse(this.game.cache.getText('map' + this.mapID));

            this.mapArea = new Phaser.Rectangle(414, 152, 700, 660);
            this.map = this.game.add.sprite(this.mapArea.left, this.mapArea.top, 'map_goblins_keep');
            this.map.inputEnabled = true;

            var boundsRect = new Phaser.Rectangle(
                this.mapArea.right - this.map.width,
                this.mapArea.bottom - this.map.height,
                2 * (this.map.width - this.mapArea.width) + this.mapArea.width,
                2 * (this.map.height - this.mapArea.height) + this.mapArea.height);

            this.map.input.boundsRect = boundsRect;

            //  do not snap to center, do not bring to top
            this.map.input.enableDrag(false, false);

            this.map.events.onDragStart.add(function (map) {
                this.initialDragPosition = map.position;
            }.bind(this));

            this.initializePinpoints();

            this.locationArea = new Phaser.Rectangle(26, 200, 290, 430);
            this.locationBackground = this.game.add.sprite(this.locationArea.left, this.locationArea.top, 'pixel_white');
            this.locationBackground.width = this.locationArea.width;
            this.locationBackground.height = this.locationArea.height;

            var titleStyle = { font: '24px ' + game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 },
                descriptionStyle = { font: '16px ' + game.utils.fontFamily, fill: '#990000', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 },
                buttonStyle = { font: '32px ' + game.utils.fontFamily, fill: '#996600', align: 'center', wordWrap: true, wordWrapWidth: this.locationArea.width - 100 };

            this.locationInfo = {}
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
            game.utils.createTextButton('Quit game', 150, game.height - 50, game.utils.styles.backButton, game.add.audio('sword'), function () {
                if (game.utils.settings.sound.musicVolume > 0) game.sound.stopAll();
                game.state.start('Menu', true, false);
            });
        },
        update: function () {
            if (this.music.volume < game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }
            this.pinpoints.position.set(this.map.position.x, this.map.position.y);
        },
        onPinpointClicked: function (pinpoint) {
            var data = pinpoint.data;
            this.currentPinpoint = pinpoint;

            switch (data.type) {
                case "EMPTY": this.setPinpointEmpty(data);
                    break;
                case "ENCOUNTER": this.setPinpointEncounter(data);
                    break;
                case "TREASURE": this.setPinpointTreasure(data);
                    break;
                case "SHOP": this.setPinpointShop(data);
                    break;
            }

            this.setPinpoints();
        }
    };

    Play.prototype.initializePinpoints = function () {
        this.pinpoints = this.game.add.group();
        this.pinpoints.position.set(this.map.position.x, this.map.position.y);
        for (index in this.mapData.pinpoints) {
            var data = this.mapData.pinpoints[index];
            var pinpoint = this.pinpoints.create(parseInt(data.x, 10) / 100 * this.map.width, parseInt(data.y, 10) / 100 * this.map.height, 'token_blue');
            pinpoint.anchor.setTo(0.5);
            pinpoint.inputEnabled = true;
            pinpoint.data = data;
            pinpoint.visible = false;
        }

        this.clearedPinpoints = [];

        this.currentPinpoint = this.pinpoints.children[0];
        this.setPinpoints();
    }

    Play.prototype.setPinpoints = function () {
        if (!this.currentPinpoint) return;

        this.pinpoints.forEach(function (pinpoint) {

            var isCurrent = (pinpoint.data.identifier === this.currentPinpoint.data.identifier),
                connectsToCurrent = (this.currentPinpoint.data.connectsTo.indexOf(pinpoint.data.identifier) > -1);

            // first we show newly discovered pinpoints
            if (isCurrent || connectsToCurrent) {
                pinpoint.visible = true;
            }

            pinpoint.events.onInputDown.removeAll();

            if (isCurrent || pinpoint.isCleared) {
                // if no encounter, we can interact with cleared pinpoints and current pinpoint
                pinpoint.events.onInputDown.add(this.onPinpointClicked.bind(this));
            } else if (this.currentPinpoint.isCleared && connectsToCurrent) {
                // if no encounter, we cal also interact with neighbouring pinpoints of the current pinpoint, as long as the current pinpoint is cleared
                pinpoint.events.onInputDown.add(this.onPinpointClicked.bind(this));
            } else {
                // finally, we can interact with neighboring pinpoints of any cleared pinpoint
                for (var index in pinpoint.data.connectsTo) {
                    id = pinpoint.data.connectsTo[index];
                    if (this.clearedPinpoints.indexOf(id) > -1) {
                        pinpoint.events.onInputDown.add(this.onPinpointClicked.bind(this));
                        break;
                    }
                }
            }

            if (isCurrent) {
                if (pinpoint.isCleared) pinpoint.loadTexture('token_red');
                else pinpoint.loadTexture('token_red_selected');
            }
            else if (!pinpoint.isCleared) pinpoint.loadTexture('token_blue_selected');
            else if (pinpoint.isCleared) pinpoint.loadTexture('token_blue');

            var isBound = pinpoint.events.onInputDown.getNumListeners() > 0;

            if (isBound) {
                this.game.add.tween(pinpoint.scale).to({ x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Bounce.Out, true);
            } else if (!isCurrent) {
                this.game.add.tween(pinpoint.scale).to({ x: 0.5, y: 0.5 }, 1000, Phaser.Easing.Bounce.Out, true);
            }
        }, this, false);
    }

    Play.prototype.setPinpointEmpty = function (data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.visible = false;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 160);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Investigate");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(function (source, cursor) {
            this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
            this.locationInfo.button.visible = false;
            this.locationInfo.description.setText(data.description);
            this.locationInfo.description.visible = true;
            // just clear the pinpoint upon investigation
            this.clearCurrentPinpoint();
        }.bind(this));

    };

    Play.prototype.setPinpointEncounter = function (data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.visible = false;
        this.locationInfo.button.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 160);
        this.locationInfo.button.setText("Investigate");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(function (source, cursor) {
            this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
            this.locationInfo.description.setText(data.description);
            this.locationInfo.description.visible = true;
            this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
            this.locationInfo.button.setText("Fight!");
            this.locationInfo.button.events.onInputDown.removeAll();
            this.locationInfo.button.events.onInputDown.add(this.startCombat.bind(this));
            this.currentPinpoint.isExplored = true;
            this.setPinpoints();
        }.bind(this));
    };

    Play.prototype.setPinpointShop = function (data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.setText(data.description);
        this.locationInfo.description.visible = true;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Shop");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(this.startShop.bind(this));

        // shop auto-clears, so we don't have to actually visit it
        this.clearCurrentPinpoint();
    };

    Play.prototype.setPinpointTreasure = function (data) {
        this.locationInfo.title.setText(data.name);
        this.locationInfo.description.visible = false;
        this.locationInfo.button.position.setTo(this.locationArea.width / 2, 160);
        this.locationInfo.button.visible = true;
        this.locationInfo.button.setText("Investigate");
        this.locationInfo.button.events.onInputDown.removeAll();
        this.locationInfo.button.events.onInputDown.add(function (source, cursor) {
            this.game.add.audio('page').play('', 0, this.game.utils.settings.sound.sfxVolume);
            this.locationInfo.description.setText(data.description);
            this.locationInfo.description.visible = true;
            this.locationInfo.button.position.setTo(this.locationArea.width / 2, 340);
            this.locationInfo.button.setText("Loot!");
            this.locationInfo.button.events.onInputDown.removeAll();
            this.locationInfo.button.events.onInputDown.add(this.startLooting.bind(this));
        }.bind(this));
    };

    Play.prototype.startCombat = function () {
        // no combat yet, so we just clear the pinpoint
        this.clearCurrentPinpoint();
    };

    Play.prototype.startShop = function () {
        // nothing yet
    };

    Play.prototype.startLooting = function () {
        // no looting yet, so we just clear the pinpoint
        this.clearCurrentPinpoint();
    };

    Play.prototype.clearCurrentPinpoint = function () {
        this.currentPinpoint.isCleared = true;
        this.clearedPinpoints.push(this.currentPinpoint.data.identifier);
        this.setPinpoints();
    }

    return Play;
});