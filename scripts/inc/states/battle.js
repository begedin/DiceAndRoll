/*globals define*/

define([
    'Phaser',
    'inc/factories/creatureFactory',
    'inc/factories/characterFactory'
], function (Phaser, CreatureFactory, CharacterFactory) {
    'use strict';

    var ROUND_TURN_TEXT_STYLE = { font: '72px Berkshire Swash', fill: '#990000', align: 'center' };

    var Battle = function (game) {
        this.game = game;
        this.creatureFactory = CreatureFactory;
        this.characterFactory = CharacterFactory;
    };

    Battle.prototype = {
        init: function (options) {
            this.options = options;

            this.isTurnInProgress = false;
        },
        preload: function () {
        },
        create: function () {

            var music;
            // check if music is enabled
            if (this.game.utils.settings.sound.musicVolume > 0) {
                // introductory fade in of theme music
                this.game.sound.stopAll();
                this.music = this.game.add.audio('battle_' + this.options.terrain);
                music = this.music.play('', 0, 0, true);
            }

            //#region add sounds

            this.soundRound = this.game.add.audio('gong');
            this.soundClick = this.game.add.audio('click');

            //#endregion

            this.turnNumber = 0;
            this.roundNumber = 0;

            // background image 
            this.game.utils.stretchAndFitImage(this.game, 'battle_' + this.options.terrain);

            // quit battle button (visible only in skirmish mode)
            if (this.options.skirmish) {
                this.game.utils.createTextButton(this.game, 'Quit battle', 140, 800, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, function () {
                    this.game.state.start('Preloader', true, false, 'Menu', this.options);
                }.bind(this));
            }

            if (this.combatants) this.combatants.destroy(false);

            this.combatants = this.game.add.group();
            this.damageIndicators = this.game.add.group();

            for (var index in this.options.playerParty) {
                var character = this.options.playerParty[index];
                var addedCharacter = this.combatants.add(this.characterFactory.create(character, 1, getPosition(1, character.type, index, this.options.playerParty.length, this.game.width, this.game.height), this.game));
                addedCharacter.customEvents.onActed.add(this.endTurn, this);
            }

            for (var enemyIndex in this.options.enemyParty) {
                var monster = this.options.enemyParty[enemyIndex];
                var addedMonster = this.combatants.add(this.creatureFactory.create(monster.name, 2, getPosition(2, monster.type, enemyIndex, this.options.enemyParty.length, this.game.width, this.game.height), this.game));
                addedMonster.customEvents.onActed.add(this.endTurn, this);
            }

            this.combatants.customSort(function (left, right) {
                return (this.game.rnd.integerInRange(0, 3)) -
                    (this.game.rnd.integerInRange(0, 3));
            }, this);
        },
        update: function () {
            if (this.music.volume < this.game.utils.settings.sound.musicVolume) {
                this.music.volume += 0.005;
            }

            if (!this.isTurnInProgress) {
                this.isTurnInProgress = true;
                this.initiateTurn();
            }
        }
    };

    // starts next turn. activates next combatant and makes combatants clickable if appropriate
    // currently also handles completely random AI for computer team
    Battle.prototype.initiateTurn = function () {

        this.checkIfBattleIsOver();

        if (this.turnNumber <= 0 || this.turnNumber >= this.combatants.countLiving()) {
            var promise = this.initiateRound();
            promise.onComplete.addOnce(this.startNextTurn, this);
        } else {
            this.startNextTurn();
        }

    };

    Battle.prototype.startNextTurn = function () {
        this.turnNumber++;

        var turnText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Turn ' + this.turnNumber, ROUND_TURN_TEXT_STYLE);
        turnText.anchor.setTo(0.5, 0.5);
        var turnTweenFadeIn = this.game.add.tween(turnText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true),
            turnTweenFadeOut = this.game.add.tween(turnText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false);

        turnTweenFadeIn.chain(turnTweenFadeOut);

        turnTweenFadeOut.onComplete.addOnce(function () {
            turnText.destroy();
        this.activeCombatant = this.combatants.next();
        this.activeCombatant.activate(this.activeCombatantClicked);
        }, this);
    };

    // starts next round. sorts semi-randomizes initiative and sorts combatants in that order
    Battle.prototype.initiateRound = function () { 
        this.turnNumber = 0;
        this.roundNumber++;

        this.soundRound.play('', 0, this.game.utils.settings.sound.sfxVolume);

        var roundText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Round ' + this.roundNumber, ROUND_TURN_TEXT_STYLE);
        roundText.anchor.setTo(0.5, 0.5);
        roundText.alpha = 0;
        var roundTweenFadeIn = this.game.add.tween(roundText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true),
            roundTweenFadeOut = this.game.add.tween(roundText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false);

        roundTweenFadeIn.chain(roundTweenFadeOut);

        roundTweenFadeOut.onComplete.addOnce(roundText.destroy, roundText);
        return roundTweenFadeOut;
    };

    // determines if all members of a single team are dead and then calles the menu screen (later, there will be a victory/defeat screen
    Battle.prototype.checkIfBattleIsOver = function () {
        var numInPlayerTeam = 0,
            numInEnemyTeam = 0;
        this.combatants.forEach(function (combatant) {
            if (combatant.team === 1) numInPlayerTeam++;
            else numInEnemyTeam++;
        }, this);

        // TODO: Split into victory/defeat
        if (numInEnemyTeam === 0 || numInPlayerTeam === 0) {
            this.options.combatResult = (numInEnemyTeam === 0) ? 'VICTORY' : 'DEFEAT';

            if (this.options.skirmish) {
                this.game.state.start('Preloader', true, false, 'SkirmishEnd', this.options);
            } else {
                this.game.state.start('Preloader', true, false, (numInEnemyTeam === 0) ? 'BattleVictory' : 'BattleDefeat', this.options);
            }
        }
    };

    Battle.prototype.endTurn = function () {
        this.combatants.forEach(function (combatant) {
            combatant.customEvents.onInputDown.removeAll();
        }, this);
        this.isTurnInProgress = false;
    };

    function getPosition(team, type, slot, totalCount, width, height) {
        var SIZE = { X: 163, Y: 220 },
            x, y;

        if (team === 1) {
            y = height - (SIZE.Y / 2 + ((type === "RANGED") ? 20 : 80));
        } else if (team === 2) {
            y = SIZE.Y / 2 + ((type === "RANGED") ? 20 : 80);
        }

        var offsetLeft = (width - ((totalCount * SIZE.X) + ((totalCount - 1) * 20))) / 2;

        x = offsetLeft + (slot * SIZE.X) + (slot > 1 ? (slot - 1) * 20 : 0) + SIZE.X / 2;

        return { x: x, y: y };
    }

    return Battle;
});