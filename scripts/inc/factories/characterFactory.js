define([
    'inc/entities/Combatant',
    'inc/factories/SpecialFactory'
], function (Combatant, SpecialFactory) {
    'use strict';

    var createWarrior = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/warrior');

        var stats = game.assets.characters ? game.assets.characters.warrior : undefined;

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'melee_attack', 'cards/emblem-axe');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var createCleric = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/cleric');

        var stats = game.assets.characters ? game.assets.characters.cleric : undefined;

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'melee_attack', 'cards/emblem-sword');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var createRanger = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/ranger');

        var stats = game.assets.characters ? game.assets.characters.ranger : undefined;

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'ranged_attack', 'cards/emblem-bow');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var createAlchemist = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/alchemist');

        var stats = game.assets.characters ? game.assets.characters.alchemist : undefined;

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'ranged_attack', 'cards/emblem-potion');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var createBeast = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/beast');

        var stats = game.assets.characters ? game.assets.characters.beast : {};

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'melee_attack', 'cards/emblem-claw');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var createPaladin = function (game, level, position) {
        var character = new Combatant(game, 1, position, 'characters/paladin');

        var stats = game.assets.characters ? game.assets.characters.paladin : undefined;

        character.setStats({
            health: stats.health || 100,
            maxHealth: stats.maxHealth ? stats.maxHealth : stats.health || 100,
            speed: stats.speed || game.rnd.integerInRange(1, 5),
            attack: stats.attack || game.rnd.integerInRange(1, 5),
            defense: stats.defense || game.rnd.integerInRange(1, 5)
        });

        character.type = stats.type;

        var attack = SpecialFactory.create(game, character, 'melee_attack', 'cards/emblem-mace');
        attack.name = stats.weapon;

        character.specials.add(attack);

        for (var index in stats.specials) {
            character.specials.add(SpecialFactory.create(game, character, stats.specials[index]));
        }

        return character;
    };

    var CharacterFactory = {};

    CharacterFactory.create = function (type, level, position, game) {
        level = level || 1;

        switch (type) {
            case 'warrior':
                return createWarrior(game, level, position);
            case 'cleric':
                return createCleric(game, level, position);
            case 'ranger':
                return createRanger(game, level, position);
            case 'alchemist':
                return createAlchemist(game, level, position);
            case 'beast':
                return createBeast(game, level, position);
            case 'paladin':
                return createPaladin(game, level, position);
        }
    };

    // since the player party persists, we need a way to set the current data
    CharacterFactory.setData = function (data) {
        this.characterData = data;
    };

    return CharacterFactory;
});