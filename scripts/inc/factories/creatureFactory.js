define([
    'inc/entities/combatant',
    'inc/entities/basicAI',
    'inc/factories/specialFactory'
], function (Combatant, BasicAI, SpecialFactory) {
    'use strict';
    
    // one createX function for each monster and/or character in the game is the idea here
    // since the objects are flexible, we could go as far as defining an AI for each monster individually, 
    // or, create several types of AIs and assing the behavior here.
    // if the code grows too complex, we can extract each indivudal creature into a separate class and instantiate it here

    var createGoblinWarrior = function (game, level, position) {

        var creature = new Combatant(game, 2, position, 'monsters/goblin_warrior');

        var stats = game.assets.monsters ? game.assets.monsters.goblin_warrior : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        var attack = SpecialFactory.create(game, creature, 'melee_attack', 'cards/emblem-axe');
        attack.name = stats.weapon;

        creature.specials.add(attack);

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    var createGoblinShaman = function (game, level, position) {

        var creature = new Combatant(game, 2, position, 'monsters/goblin_shaman');

        var stats = game.assets.monsters ? game.assets.monsters.goblin_shaman : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        var attack = SpecialFactory.create(game, creature, 'ranged_attack', 'cards/emblem-potion');
        attack.name = stats.weapon;

        creature.specials.add(attack);

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    var createGoblinBerserker = function (game, level, position) {

        var creature = new Combatant(game, 2, position, 'monsters/goblin_berserker');

        var stats = game.assets.monsters ? game.assets.monsters.goblin_berserker : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        var attack = SpecialFactory.create(game, creature, 'melee_attack', 'cards/emblem-sword');
        attack.name = stats.weapon;

        creature.specials.add(attack);

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    var createMonstrousSpider = function (game, level, position) {

        var creature = new Combatant(game, 2, position, 'monsters/monstrous_spider');

        var stats = game.assets.monsters ? game.assets.monsters.monstrous_spider : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        var attack = SpecialFactory.create(game, creature, 'melee_attack', 'cards/emblem-claw');
        attack.name = stats.weapon;

        creature.specials.add(attack);

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    var createGnoll = function (game, level, position) {

        var creature = new Combatant(game, 2, position, 'monsters/gnoll');

        var stats = game.assets.monsters ? game.assets.monsters.gnoll : {};

        creature.setStats({
            health: stats.health || 60,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 60,
            speed: stats.speed || game.rnd.integerInRange(1, 20),
            attack: stats.attack || game.rnd.integerInRange(1, 20),
            defense: stats.defense || game.rnd.integerInRange(1, 8)
        });

        creature.type = stats.type;

        var attack = SpecialFactory.create(game, creature, 'melee_attack', 'cards/emblem-axe');
        attack.name = stats.weapon;

        creature.specials.add(attack);

        creature.ai = new BasicAI(game, creature);

        return creature;
    };

    var CreatureFactory = {};

    CreatureFactory.create = function (type, level, position, game) {
        level = level || 1;

        switch (type) {
            case 'goblin_warrior':
                return createGoblinWarrior(game, level, position);
            case 'goblin_shaman':
                return createGoblinShaman(game, level, position);
            case 'goblin_berserker':
                return createGoblinBerserker(game, level, position);
            case 'monstrous_spider':
                return createMonstrousSpider(game, level, position);
            case 'gnoll':
                return createGnoll(game, level, position);
        }
    };

    return CreatureFactory;
});