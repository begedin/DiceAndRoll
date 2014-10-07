var app = app || {},
    define = define || {};

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

            this.setPlaceholderData();

            this.isTurnInProgress = false;
        },
        preload: function () {

            //TODO: move to preloader

            for (var index in this.options.playerParty) {
                var character = this.options.playerParty[index];
                this.game.load.image('characters/' + character.name, 'assets/players/' + character.name + '.png');
            }

            this.game.load.image('cards/back', 'assets/cards/card-back.png');
            this.game.load.image('cards/front', 'assets/cards/card-front.png');
            this.game.load.image('cards/faction-1', 'assets/cards/card-faction-1.png');
            this.game.load.image('cards/faction-2', 'assets/cards/card-faction-2.png');
            this.game.load.image('cards/emblem-axe', 'assets/cards/card-axe.png');
            this.game.load.image('cards/emblem-mace', 'assets/cards/card-mace.png');
            this.game.load.image('cards/emblem-potion', 'assets/cards/card-potion.png');
            this.game.load.image('cards/emblem-bow', 'assets/cards/card-bow.png');
            this.game.load.image('cards/emblem-shield', 'assets/cards/card-shield.png');
            this.game.load.image('cards/emblem-sword', 'assets/cards/card-sword.png');
            this.game.load.image('cards/emblem-claw', 'assets/cards/card-claw.png');

            this.game.load.image('specials/rage', 'assets/specials/rage.png');
            this.game.load.image('specials/chain_attack', 'assets/specials/chain_attack.png');
            this.game.load.image('specials/ground_strike', 'assets/specials/ground_strike.png');
            this.game.load.image('specials/elemental_fear', 'assets/specials/elemental_fear.png');

            this.game.load.image('specials/healing_potion', 'assets/specials/healing_potion.png');
            this.game.load.image('specials/bless', 'assets/specials/bless.png');
            this.game.load.image('specials/negate_spell', 'assets/specials/negate_spell.png');
            this.game.load.image('specials/team_heal', 'assets/specials/team_heal.png');

            this.game.load.image('specials/bullseye', 'assets/specials/bullseye.png');
            this.game.load.image('specials/tripple_shot', 'assets/specials/tripple_shot.png');
            this.game.load.image('specials/poisoned_arrow', 'assets/specials/poisoned_arrow.png');
            this.game.load.image('specials/drain_arrow', 'assets/specials/drain_arrow.png');

            this.game.load.image('specials/electric_shock', 'assets/specials/electric_shock.png');
            this.game.load.image('specials/poison_gas', 'assets/specials/poison_gas.png');
            this.game.load.image('specials/mechanical_arm', 'assets/specials/mechanical_arm.png');
            this.game.load.image('specials/fusion_cannon', 'assets/specials/fusion_cannon.png');

            this.game.load.image('specials/attack_claws', 'assets/specials/attack_claws.png');
            this.game.load.image('specials/tail_strike', 'assets/specials/tail_strike.png');
            this.game.load.image('specials/deadly_bite', 'assets/specials/deadly_bite.png');
            this.game.load.image('specials/brutal_flame', 'assets/specials/brutal_flame.png');

            this.game.load.image('specials/leadership', 'assets/specials/leadership.png');
            this.game.load.image('specials/holy_weapon', 'assets/specials/holy_weapon.png');
            this.game.load.image('specials/sturded_armor', 'assets/specials/sturded_armor.png');
            this.game.load.image('specials/call_of_griffin', 'assets/specials/call_of_griffin.png');

            this.game.load.image('monsters/goblin_warrior', 'assets/monsters/goblin_warrior.png');
            this.game.load.image('monsters/goblin_berserker', 'assets/monsters/goblin_berserker.png');
            this.game.load.image('monsters/goblin_shaman', 'assets/monsters/goblin_shaman.png');
            this.game.load.image('monsters/goblin_king', 'assets/monsters/goblin_berserker.png');
            this.game.load.image('monsters/gnoll', 'assets/monsters/gnoll.png');
            this.game.load.image('monsters/monstrous_spider', 'assets/monsters/monstrous_spider.png');
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
                    this.music = this.game.add.audio('battle-' + this.options.terrain);
                    music = this.music.play('', 0, 0, true);
                }
            }

            this.turnNumber = 0;
            this.roundNumber = 0;

            // background image on the bottom of the screen
            this.background = this.game.add.sprite(this.game.width / 2, this.game.height, 'battle-' + this.options.terrain);
            this.background.anchor.setTo(0.5, 1);

            if (this.combatants) this.combatants.destroy(false);

            this.combatants = this.game.add.group();
            this.damageIndicators = this.game.add.group();

            for (var index in this.options.playerParty) {
                var character = this.options.playerParty[index];
                var addedCharacter = this.combatants.add(this.characterFactory.create(character.name, 1, getPosition(1, character.type, index, this.options.playerParty.length, this.game.width, this.game.height), this.game));
                addedCharacter.customEvents.onActed.add(this.endTurn, this);
            }

            for (var index in this.options.enemyParty) {
                var monster = this.options.enemyParty[index];
                var addedMonster = this.combatants.add(this.creatureFactory.create(monster.name, 2, getPosition(2, monster.type, index, this.options.enemyParty.length, this.game.width, this.game.height), this.game));
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

            this.checkIfBattleIsOver();

            if (!this.isTurnInProgress) {
                this.isTurnInProgress = true;
                this.initiateTurn();
            }
        }
    };

    // starts next turn. activates next combatant and makes combatants clickable if appropriate
    // currently also handles completely random AI for computer team
    Battle.prototype.initiateTurn = function () {
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
        if (numInEnemyTeam === 0 || numInPlayerTeam === 0) this.game.state.start('Menu');
    };

    Battle.prototype.endTurn = function () {
        this.combatants.forEach(function (combatant) {
            combatant.customEvents.onInputDown.removeAll();
        }, this);
        this.isTurnInProgress = false;
    };

    // sets placeholder data for state testing
    Battle.prototype.setPlaceholderData = function () {

        this.options = {
            terrain: 'grass',
            playerParty: [],
            enemyParty: []
        };

        this.options.playerParty.push(this.game.assets.characters.warrior);
        this.options.playerParty.push(this.game.assets.characters.cleric);
        this.options.playerParty.push(this.game.assets.characters.ranger);
        this.options.playerParty.push(this.game.assets.characters.beast);
        this.options.playerParty.push(this.game.assets.characters.alchemist);
        this.options.playerParty.push(this.game.assets.characters.paladin);

        this.options.enemyParty.push({ name: 'goblin_warrior', type: 'MELEE' });
        this.options.enemyParty.push({ name: 'goblin_berserker', type: 'MELEE' });
        this.options.enemyParty.push({ name: 'goblin_berserker', type: 'MELEE' });
        this.options.enemyParty.push({ name: 'goblin_shaman', type: 'RANGED' });
        this.options.enemyParty.push({ name: 'goblin_shaman', type: 'RANGED' });
        this.options.enemyParty.push({ name: 'goblin_shaman', type: 'RANGED' });
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