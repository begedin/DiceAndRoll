// game.party.push(character)
// game.campaign = ? map(s).pinpoints

var app = app || {},
    define = define || {};

/// currently unused, was the old level loader, without the combat

define("New", ['Phaser'], function (New) {
    'use strict';
    app.New = function (game) {
        this.game = game;
    };

    app.New.prototype = {
        preload: function () {
        },
        create: function () {

            // set screen background
            game.utils.stretchAndFitImage('new');
        },
        update: function () {
        }
    };
});