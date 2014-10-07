var app = app || {},
    define = define || {};

define("BattleGrid", [], function () {
    'use strict';
    app.BattleGrid = function (game) {
	    this.game = game;

	};

    app.BattleGrid.prototype = {
		preload: function () {
		},
		create: function () {
			this.spawnBoard(this.game);
		},
		update: function () {
		}
	};

    app.BattleGrid.prototype.spawnBoard = function (game) {
       
        this.tiles = game.add.group();

        for (var i = 0; i < this.game.globals.BOARD_SIZE.x * this.game.globals.BOARD_SIZE.y; i++) {
            var position = {
                x: 10 + (i % 3) * this.game.globals.tileSize + this.game.globals.tileSize / 2,
                y: 10 + Math.floor(i / 3) * this.game.globals.tileSize + this.game.globals.tileSize / 2
            };
            var tile = this.tiles.create(position.x, position.y, 'ground');
            tile.anchor.setTo(0.5);
            if (tile.texture.width > this.game.globals.tileSize) {
                tile.scale.setTo(this.game.globals.tileSize / tile.texture.width);
            } else {
                tile.scale.setTo(1);
            }
        }
	};

    return app.BattleGrid;
});