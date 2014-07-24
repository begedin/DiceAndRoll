var app = app || {},
    define = define || {};

/// currently unused, was the old level loader, without the combat

define("Play", ['Phaser', 'BattleGrid'], function (Play, BattleGrid) {
    'use strict';
    app.Play = function(game){
        this.game = game;
    };

    app.Play.prototype = {
        preload: function(){
            this.battleGrid = new BattleGrid(this.game);
            this.battleGrid.preload();
        },
        create: function(){
            this.battleGrid.create();
        },
        update: function(){
            this.battleGrid.update();
        }
    };
});