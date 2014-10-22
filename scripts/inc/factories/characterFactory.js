 /*globals define*/

define([
    'inc/entities/combatant',
    'inc/factories/specialFactory'
], function (Combatant, SpecialFactory) {
    'use strict';

    var CharacterFactory = {};

    CharacterFactory.create = function (stats, level, position, game) {
        level = level || 1;

        var character = new Combatant(game, 1, position, 'characters/' + stats.name);

        character.setStats(stats);
        character.type = stats.type;

        // load the selected weapon - every character MUST have a weapon defined to fight with!
        var weapon = game.assets.weapons[stats.weapon];
        var attack = SpecialFactory.create(game, character, weapon, true);
        attack.name = weapon.title;

        character.specials.add(attack);

        for (var index = 0; index < stats.specialsUsed; index++) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    return CharacterFactory;
});