// main.js
// This javascript file represents the entry point of the phaser application.

/// <reference path="/scripts/vendor/phaser.js" />


requirejs.config({
    baseUrl: 'scripts',
    paths: { Phaser: 'vendor/phaser' }
});

require([
    'Phaser',
    'inc/states/boot',
    'inc/states/preloader',
    'inc/states/menu',
    'inc/states/new',
    'inc/states/play',
    'inc/states/battle',
    /*'inc/states/shop',*/
    'inc/states/end'
], function (Phaser, Boot, Preloader, Menu, New, Play, Battle,/* Shop,*/ End) {

    var A4 = { height: 297, width: 210 };
    // create new phaser game
    game = new Phaser.Game(A4.height * 4, A4.width * 4, Phaser.AUTO, 'game');

    // add game states
    game.state.add('Boot', Boot);
    game.state.add('Preloader', Preloader);
    game.state.add('Menu', Menu);
    game.state.add('New', New);
    game.state.add('Play', Play);
    game.state.add('Battle', Battle);
    //game.state.add('Shop', Shop);
    game.state.add('End', End);

    // start game from the boot state
    game.state.start('Boot');
});