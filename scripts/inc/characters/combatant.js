var app = app || {},
    define = define || {};

define('Combatant', ['Phaser'], function (Phaser) {
    'use strict';
    var TEAMS = { FRIEND: 1, ENEMY: 2 };
    
	app.Combatant = function (game, team, position, combatantClicked) {
        this.game = game;
		this.positionInBattle = position;
        this.team = team;
        this.active = false;
      
        var positionData = this.getPositionOnScreen();
        if (this.team === TEAMS.FRIEND) {
            Phaser.Sprite.call(this, game, positionData.x, positionData.y, 'token_blue');
        } else {
            Phaser.Sprite.call(this, game, positionData.x, positionData.y, 'token_red');
        }

        if (this.texture.width > app.tileSize) {
            this.scale.setTo(app.tileSize / this.texture.width);
        } else {
            this.scale.setTo(1);
        }

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.events.onInputDown.add(combatantClicked);
        this.events.onKilled.add(this.combatantKilled.bind(this));
    };
    
    app.Combatant.prototype = Object.create(Phaser.Sprite.prototype);
    app.Combatant.prototype.constructor = app.Combatant;
    
    app.Combatant.prototype.getPositionOnScreen = function () {

        var position = { 
            x: 10 + (this.positionInBattle % 3) * app.tileSize + app.tileSize / 2,
            y: 10 + Math.floor(this.positionInBattle / 3) * app.tileSize + app.tileSize / 2 + (this.team === TEAMS.ENEMY ? app.tileSize * 2 : 0)
        }
        
        return position;
    };

    app.Combatant.prototype.activate = function () {
        if (this.team === TEAMS.FRIEND) {
            this.loadTexture('token_blue_selected')
        } else {
            this.loadTexture('token_red_selected')
        }

        this.isAttacking = true;
    }

    app.Combatant.prototype.deactivate = function () {
        if (this.team === TEAMS.FRIEND) {
            this.loadTexture('token_blue')
        } else {
            this.loadTexture('token_red')
        }

        this.isAttacking = false;
    }

    app.Combatant.prototype.combatantKilled = function () {
        this.parent.remove(this);
    };

	return app.Combatant;
});