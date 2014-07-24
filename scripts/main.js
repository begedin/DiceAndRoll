// main.js
// This javascript file represents the entry point of the phaser application.

/// <reference path="/scripts/vendor/phaser.js" />

requirejs.config({
	baseUrl: 'scripts',
	paths: {
        // phaser engine
	    Phaser: 'vendor/phaser',
        // phaser states
		Boot: 'inc/states/boot',
		Preloader: 'inc/states/preloader',
		Menu: 'inc/states/menu',
		New: 'inc/states/new',
		Play: 'inc/states/play',
		Battle: 'inc/states/battle',
		Shop: 'inc/states/shop',
		End: 'inc/states/end',
        // additional modules
		Campaign: 'inc/modules/campaign',
		Map: 'inc/modules/map',
		BattleGrid: 'inc/modules/battlegrid',
        // characters
		Combatant: 'inc/characters/combatant',
        Adventurer: 'inc/characters/adventurer'
	}
});

require(['Phaser', 'Boot', 'Preloader', 'Menu', 'New', 'Play', 'Battle'],

	function (Phaser) {

	    var A4 = { height: 297, width: 210 };
        // create new phaser game
	    game = new Phaser.Game(A4.height * 4, A4.width * 4, Phaser.AUTO);

        // add game states
		game.state.add('Boot', app.Boot);
		game.state.add('Preloader', app.Preloader);
		game.state.add('Menu', app.Menu);
		game.state.add('New', app.New);
		game.state.add('Play', app.Play);
		game.state.add('Battle', app.Battle);
		game.state.add('Shop', app.Shop);
		game.state.add('End', app.End);

        // start game from the boot state
		game.state.start('Boot');
	}
);