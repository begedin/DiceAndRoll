var app = app || {},
    define = define || {};

define("Battle", ['Phaser', 'BattleGrid', 'Adventurer'], function (Phaser, BattleGrid, Adventurer) {
    'use strict';

    app.Battle = function (game) {
        this.game = game;
    };

    app.Battle.prototype = {
        preload: function () {
            this.battleGrid = new BattleGrid(this.game);
            this.battleGrid.preload();
            this.isTurnInProgress = false;
            this.turnNumber = -1;
        },
        create: function () {
            
            // background image on the bottom of the screen
            this.background = this.game.add.sprite(this.game.width / 2, this.game.height, 'bg');
            this.background.anchor.setTo(0.5, 1);
            
            // set battle area size in relation to screen
            var setBattleArea = function () {
                var newHeight = window.innerHeight,
                    newWidth = window.innerWidth;

                var scaleX = newWidth / this.game.globals.VIRTUAL_WIDTH,
                    scaleY = newHeight / this.game.globals.VIRTUAL_HEIGHT;

                var battleAreaWidth = this.game.globals.VIRTUAL_WIDTH * scaleY > newWidth ? this.game.globals.VIRTUAL_WIDTH * scaleX : this.game.globals.VIRTUAL_WIDTH * scaleY;

                this.game.globals.tileSize = (battleAreaWidth - 20) / 3;
            }
            setBattleArea.call(this);

            this.battleGrid.create();

            if (this.combatants) this.combatants.destroy(false);

            this.combatants = this.game.add.group();
            this.damageIndicators = this.game.add.group();

            // set position and size of graphical elements on screen
            var setGraphics = function () {
                var scaleX = this.game.width / this.game.globals.VIRTUAL_WIDTH,
                    scaleY = this.game.height / this.game.globals.VIRTUAL_HEIGHT;

                // size of the square square in which the actual ui (battle grid, combatants, buttons) are placed
                var battleAreaSize = {
                    x: this.game.globals.VIRTUAL_WIDTH * scaleY > this.game.width ? this.game.globals.VIRTUAL_WIDTH * scaleX : this.game.globals.VIRTUAL_WIDTH * scaleY,
                    y: this.game.globals.VIRTUAL_WIDTH * scaleY > this.game.height ? this.game.globals.VIRTUAL_HEIGHT * scaleX : this.game.globals.VIRTUAL_HEIGHT * scaleY
                }

                // top left coordinate of the square square in which the actual ui (battle grid, combatants, buttons) are placed
                var offset = {
                    x: (this.game.width - battleAreaSize.x) / 2,
                    y: (this.game.height - battleAreaSize.y) / 2
                }

                if (this.battleGrid && this.battleGrid.tiles) {
                    this.battleGrid.tiles.x = offset.x;
                    this.battleGrid.tiles.y = offset.y;
                }

                if (this.combatants) {
                    this.combatants.x = offset.x;
                    this.combatants.y = offset.y;
                }

                if (this.damageIndicators) {
                    this.damageIndicators.x = offset.x;
                    this.damageIndicators.y = offset.y;
                }

                if (this.background) {
                    this.background.position.setTo(this.game.width / 2, this.game.height);
                }
            }
            setGraphics.call(this);

            this.combatants.add(new Adventurer(this.game, 1, 0, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 1, 1, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 1, 2, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 2, 0, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 2, 1, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 2, 2, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 2, 3, this.inactiveCombatantClicked.bind(this)));
            this.combatants.add(new Adventurer(this.game, 2, 4, this.inactiveCombatantClicked.bind(this)));
        },
        update: function () {

            this.checkIfBattleIsOver();

            this.battleGrid.update();

            if (!this.isTurnInProgress) {
                this.startNextTurn();
            }
        }
    };

    app.Battle.prototype.inactiveCombatantClicked = function(targetCombatant, pointer){

        if (this.activeCombatant
            && this.activeCombatant.isAttacking
            && this.activeCombatant != targetCombatant
            && this.activeCombatant.team != targetCombatant.team) {

            var damage = 1;
            targetCombatant.damage(damage);
            
            var damageText = this.game.add.text(targetCombatant.position.x, targetCombatant.position.y, damage, { font: '65px Arial', fill: '#ff0000', align: 'center' },this.damageIndicators);
            damageText.anchor.setTo(0.5, 0.5);
            this.game.add.tween(damageText).to({ alpha: 0, y: targetCombatant.position.y - 60 }, 600).start().onComplete.add(damageText.destroy.bind(damageText, false));

            this.activeCombatant.deactivate();
            this.activeCombatant = null;
            this.isTurnInProgress = false;
        } else {

        }
    };

    app.Battle.prototype.activeCombatantClicked = function (sprite, pointer) {

    };

    app.Battle.prototype.startNextTurn = function () {

        if (this.turnNumber <= 0 || this.turnNumber >= this.combatants.children.length) {
            this.initiateRound();
        }

        this.turnNumber++;
        this.isTurnInProgress = true;
        this.activeCombatant = this.combatants.children[this.turnNumber - 1];
        this.activeCombatant.activate(this.activeCombatantClicked);
    };

    app.Battle.prototype.initiateRound = function () {
        this.combatants.customSort(function (left, right) {
            return (right.speed + this.game.rnd.integerInRange(0,3)) -
                (left.speed + this.game.rnd.integerInRange(0, 3));
        },this);
        this.turnNumber = 0;
    };

    app.Battle.prototype.checkIfBattleIsOver = function () {
        var numInRedTeam = 0,
            numInBlueTeam = 0;
        this.combatants.forEach(function (combatant) {
            if (combatant.team === 1) numInBlueTeam++;
            else numInRedTeam++;
        }, this);

        if (numInRedTeam === 0 || numInBlueTeam === 0) this.game.state.start('Menu');
    }
});