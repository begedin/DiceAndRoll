// represents a special class of character/monster

var app = app || {},
    define = define || {};

define('Adventurer', ['Combatant'], function (Combatant) {
    'use strict';
    app.Adventurer = function (game, team, position, combatantClicked) {
        Combatant.call(this, game, team, position, combatantClicked);

        this.alive = true;
        this.health = game.rnd.integerInRange(0, 5);
        this.speed = game.rnd.integerInRange(0, 5);
    };

    app.Adventurer.prototype = Object.create(Combatant.prototype);
    app.Adventurer.prototype.constructor = app.Adventurer;

    return app.Adventurer;
});