/*globals define*/

define([
    'inc/entities/combatant',
    'inc/entities/basicAI',
    'inc/factories/specialFactory'
], function (Combatant, BasicAI, SpecialFactory) {
    'use strict';
    
    var CreatureFactory = {};

    CreatureFactory.create = function (type, level, position, game) {
        level = level || 1;

        var creature = new Combatant(game, 2, position, 'monsters/' + type);

        var stats = game.assets.monsters ? game.assets.monsters[type] : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        // load the weapon from creature - every creature MUST have a weapon defined to fight with!
        var weapon = game.assets.weapons[stats.weapon];
        var attack = SpecialFactory.create(game, creature, weapon, true);
        attack.name = weapon.title;

        creature.specials.add(attack);

        if (stats.specials) {
            for (var index = 0; index < stats.specials.length; index++) {
                creature.specials.add(SpecialFactory.create(game, creature, stats.specials[index]));
            }
        }

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    return CreatureFactory;
});