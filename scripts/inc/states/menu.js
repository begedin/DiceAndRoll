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
            var style = { font: '72px Colonna MT', fill: '#990000', align: 'center' };

            var addMenuItem = function (text, position, style, action) {
                var item = game.add.text(game.width / 2 + 20, 225 + position * 70, text, style);
                item.anchor.setTo(0.5, 0.5);
                item.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

                //var gradient = item.context.createLinearGradient(0, 0, 0, item.canvas.height);
                //gradient.addColorStop(0, '#8ED6FF');
                //gradient.addColorStop(1, '#004CB3');
                //item.fill = gradient;

                item.inputEnabled = true;
                //item.events.onInputOver.add(function (source, cursor) { source.setStyle({ font: '64px Colonna MT', fill: '#ff0000', align: 'center' }); });
                //item.events.onInputOut.add(function (source, cursor) { source.setStyle({ font: '64px Colonna MT', fill: '#FF6A00', align: 'center' }); });
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