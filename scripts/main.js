/*globals requirejs*/

// main.js
// This javascript file represents the entry point of the phaser application.

/// <reference path="../scripts/vendor/phaser.js" />

requirejs.config({
    baseUrl: 'scripts',
    paths: {
        Phaser: 'vendor/phaser',
        Store: 'vendor/store'
    }
});

requirejs([
    'Phaser',
    'Store',
    'inc/states/boot',
    'inc/states/preloader',
    'inc/states/menu',
    'inc/states/new',
    'inc/states/play',
    'inc/states/battle',
    /*'inc/states/shop',*/
    'inc/states/battleVictory',
    'inc/states/battleDefeat',
    'inc/states/mapVictory',
    'inc/states/skirmishEnd'
], function (Phaser, Store, Boot, Preloader, Menu, New, Play, Battle,/* Shop,*/ BattleVictory, BattleDefeat, MapVictory, SkirmishEnd) {

    var A4 = { height: 297, width: 210 };
    // create new phaser game
    var game = new Phaser.Game(A4.height * 4, A4.width * 4, Phaser.AUTO, 'game', null, false, false);

    game.store = Store;

    // add game states
    game.state.add('Boot', Boot);
    game.state.add('Preloader', Preloader);
    game.state.add('Menu', Menu);
    game.state.add('New', New);
    game.state.add('Play', Play);
    game.state.add('Battle', Battle);
    //game.state.add('Shop', Shop);
    game.state.add('BattleVictory', BattleVictory);
    game.state.add('BattleDefeat', BattleDefeat);
    game.state.add('MapVictory', MapVictory);
    game.state.add('SkirmishEnd', SkirmishEnd);

    // start game from the boot state
    game.state.start('Boot');
});