// preloader.js
// This javascript file represents phaser state for main menu.

/// <reference path="/scripts/vendor/phaser.js" />

define("Menu", ['Phaser'], function (Phaser) {
    'use strict';
    app.Menu = function (game) {
        this.game = game;
    };

    app.Menu.prototype = {
        preload: function () {},
        create: function () {

            // set screen background
            game.utils.stretchAndFitImage('menu');

            // build up the main menu options
            var style = { font: '64px Colonna MT', fill: '#FF6A00', align: 'center' };

            var addMenuItem = function (text, position, style, action) {
                var item = game.add.text(game.width / 2, 200 + position * 80, text, style);
                item.anchor.setTo(0.5, 0.5);

                item.inputEnabled = true;
                item.events.onInputOver.add(function (source, cursor) { source.setStyle({ font: '64px Colonna MT', fill: '#ff0000', align: 'center' }); });
                item.events.onInputOut.add(function (source, cursor) { source.setStyle({ font: '64px Colonna MT', fill: '#FF6A00', align: 'center' }); });
                item.events.onInputDown.add(function (source, cursor) { source.setStyle({ font: '64px Colonna MT', fill: '#990000', align: 'center' }); });
                item.events.onInputUp.add(function (source, cursor) {
                    source.setStyle({ font: '64px Colonna MT', fill: '#FF6A00', align: 'center' });
                    if (action) action.call();
                });
            };

            addMenuItem('New Game', 1, style, function () { game.state.start('New'); });
            addMenuItem('Continue', 2, style, function () { game.state.start('Play'); });
            addMenuItem('Settings', 3, style, function () { game.state.start('Battle'); });
            addMenuItem('Credits', 4, style);
            addMenuItem('Quit', 5, style);
        },
        update: function () {
        }
    };
});