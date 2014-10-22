/*globals define*/

define(['Phaser'], function (Phaser) {

    var HORIZONTAL_MARGIN = 10,
        SIZE = { WIDTH: 330, HEIGHT: 140 },
        BOUNDS = {
            LEFT: -1 * SIZE.WIDTH / 2 - 10,
            RIGHT: SIZE.WIDTH / 2 - 10,
            TOP: -1 * SIZE.HEIGHT / 2,
            BOTTOM: SIZE.HEIGHT / 2
        },
        ITEM_CARD_SIZE = { WIDTH: 75, HEIGHT: 105 },
        SPECIAL_CARD_SIZE = { WIDTH: ITEM_CARD_SIZE.WIDTH, HEIGHT: ITEM_CARD_SIZE.WIDTH },
        WEAPON_REWARD_POSITION = {
            X: BOUNDS.LEFT + ITEM_CARD_SIZE.WIDTH / 2,
            Y: BOUNDS.TOP + ITEM_CARD_SIZE.HEIGHT / 2
        },
        ARMOR_REWARD_POSITION = {
            X: BOUNDS.RIGHT - ITEM_CARD_SIZE.WIDTH / 2,
            Y: WEAPON_REWARD_POSITION.Y
        },
        SPECIAL_REWARD_POSITION = {
            X: 0,
            Y: WEAPON_REWARD_POSITION.Y
        },
        BUTTON_POSITION = {
            X: 0,
            Y: BOUNDS.BOTTOM
        },
        INSTRUCTION_STYLE = { font: '20px Berkshire Swash', fill: '#009900', align: 'center', wordWrap: true, wordWrapWidth: SIZE.WIDTH - 20, stroke: '#000000', strokeThickness: 2 },
        TITLE_STYLE = { font: '16px Berkshire Swash', fill: '#FF6A00', align: 'center' },
        DETAIL_STYLE = { font: '12px Berkshire Swash', fill: '#FF6A00', align: 'center' },
        CONFIRM_BUTTON_STYLE = { font: '24px Berkshire Swash', fill: '#990000', align: 'center', stroke: '#000000', strokeThickness: 2 },
        CONFIRM_BUTTON_PRESSED_STYLE = { font: '22px Berkshire Swash', fill: '#FF6A00', align: 'center', stroke: '#000000', strokeThickness: 2 };


    var LevelRewardSelector = function (game, character, scale) {
        this.game = game;
        this.character = character;

        Phaser.Group.call(this, this.game, null, 'reward_selector');
        this.position.setTo(this.game.width / 2, this.game.height / 2);
        this.scale.setTo(scale);

        this.instructionText = this.add(new Phaser.Text(this.game, 0, BOUNDS.TOP - 30, "Select your reward", INSTRUCTION_STYLE));
        this.instructionText.anchor.setTo(0.5);

        var isMaxWeaponLevel = this.character.weapons.indexOf(this.character.weapon) === this.character.weapons.length - 1,
            weaponName = isMaxWeaponLevel ? this.character.weapons[this.character.weapons.length - 1] : this.character.weapons[this.character.weapons.indexOf(this.character.weapon) + 1],
            weapon = this.game.assets.weapons[weaponName];

        this.weaponReward = this.create(WEAPON_REWARD_POSITION.X, WEAPON_REWARD_POSITION.Y, 'weapons/' + weaponName);
        this.weaponReward.anchor.setTo(0.5);
        this.weaponReward.scale.setTo(ITEM_CARD_SIZE.HEIGHT / this.weaponReward.texture.height);
        //this.weaponReward.title = this.add(new Phaser.Text(this.game, WEAPON_REWARD_POSITION.X, WEAPON_REWARD_POSITION.Y - ITEM_CARD_SIZE.HEIGHT / 2 - 5, isMaxWeaponLevel ? "Max" : weapon.title, TITLE_STYLE));
        //this.weaponReward.title.anchor.setTo(0.5, 1);
        this.weaponReward.detail = this.add(new Phaser.Text(this.game, WEAPON_REWARD_POSITION.X, WEAPON_REWARD_POSITION.Y + ITEM_CARD_SIZE.HEIGHT / 2 + 5, isMaxWeaponLevel ? "Maxed out" : "Attack +" + weapon.attack, DETAIL_STYLE));
        this.weaponReward.detail.anchor.setTo(0.5, 0);
        this.weaponReward.data = weapon;

        if (!isMaxWeaponLevel) {
            this.weaponReward.inputEnabled = true;
            this.weaponReward.events.onInputDown.add(this.selectWeaponReward, this);
        }

        var isMaxArmorLevel = this.character.armors.indexOf(this.character.armor) === this.character.armors.length - 1,
            armorName = isMaxArmorLevel ? this.character.armors[this.character.armors.length - 1] : this.character.armors[this.character.armors.indexOf(this.character.armor) + 1],
            armor = this.game.assets.armors[armorName];

        this.armorReward = this.create(ARMOR_REWARD_POSITION.X, ARMOR_REWARD_POSITION.Y, 'armors/' + armorName);
        this.armorReward.anchor.setTo(0.5);
        this.armorReward.scale.setTo(ITEM_CARD_SIZE.HEIGHT / this.armorReward.texture.height);
        this.armorReward.data = armor;
        //this.armorReward.title = this.add(new Phaser.Text(this.game, ARMOR_REWARD_POSITION.X, ARMOR_REWARD_POSITION.Y - ITEM_CARD_SIZE.HEIGHT / 2 - 5, isMaxArmorLevel ? "Max" : armor.title, TITLE_STYLE));
        //this.armorReward.title.anchor.setTo(0.5, 1);
        this.armorReward.detail = this.add(new Phaser.Text(this.game, ARMOR_REWARD_POSITION.X, ARMOR_REWARD_POSITION.Y + ITEM_CARD_SIZE.HEIGHT / 2 + 5, isMaxArmorLevel ? "Maxed out" : "Defense +" + armor.defense, DETAIL_STYLE));
        this.armorReward.detail.anchor.setTo(0.5, 0);

        if (!isMaxArmorLevel) {
            this.armorReward.inputEnabled = true;
            this.armorReward.events.onInputDown.add(this.selectArmorReward, this);
        }

        var isMaxSpecialLevel = this.character.specialsUsed === this.character.specials.length,
            specialName = isMaxSpecialLevel ? this.character.specials[this.character.specialsUsed - 1] : this.character.specials[this.character.specialsUsed],
            special = this.game.assets.specials[specialName];

        this.specialReward = this.create(SPECIAL_REWARD_POSITION.X, SPECIAL_REWARD_POSITION.Y, 'specials/' + specialName);
        this.specialReward.anchor.setTo(0.5);
        this.specialReward.scale.setTo(SPECIAL_CARD_SIZE.HEIGHT / this.specialReward.texture.height);
        this.specialReward.data = special;
        //this.specialReward.title = this.add(new Phaser.Text(this.game, SPECIAL_REWARD_POSITION.X, SPECIAL_REWARD_POSITION.Y - SPECIAL_CARD_SIZE.HEIGHT / 2, isMaxSpecialLevel ? "Max" : special.name, TITLE_STYLE));
        //this.specialReward.title.anchor.setTo(0.5, 1);
        this.specialReward.detail = this.add(new Phaser.Text(this.game, SPECIAL_REWARD_POSITION.X, SPECIAL_REWARD_POSITION.Y + SPECIAL_CARD_SIZE.HEIGHT / 2, isMaxSpecialLevel ? "Maxed out" : special.name, DETAIL_STYLE));
        this.specialReward.detail.anchor.setTo(0.5, 0);

        if (!isMaxSpecialLevel) {
            this.specialReward.inputEnabled = true;
            this.specialReward.events.onInputDown.add(this.selectSpecialReward, this);
        }

        this.selectButton = this.add(new Phaser.Text(this.game, BUTTON_POSITION.X, BUTTON_POSITION.Y, "Confirm", CONFIRM_BUTTON_STYLE));
        this.selectButton.anchor.setTo(0.5, 1);
        this.selectButton.inputEnabled = true;
        this.selectButton.events.onInputDown.add(this.confirm, this);
        this.selectButton.events.onInputUp.add(this.resetSelectButtonStyle, this);

        this.onSelected = new Phaser.Signal();
    };

    LevelRewardSelector.prototype = Object.create(Phaser.Group.prototype);
    LevelRewardSelector.prototype.constructor = LevelRewardSelector;

    LevelRewardSelector.prototype.selectWeaponReward = function (source, cursor) {
        this.selectedReward = {
            type: 'WEAPON',
            name: source.data.name
        };
        this.instructionText.setText(source.data.title);
        this.selected = true;
    };

    LevelRewardSelector.prototype.selectArmorReward = function (source, cursor) {
        this.selectedReward = {
            type: 'ARMOR',
            name: source.data.name
        };
        this.instructionText.setText(source.data.title);
        this.selected = true;
    };

    LevelRewardSelector.prototype.selectSpecialReward = function (source, cursor) {
        this.selectedReward = {
            type: 'SPECIAL',
            name: source.data.name
        };
        this.instructionText.setText(source.data.description);
        this.selected = true;
    };

    LevelRewardSelector.prototype.confirm = function (source) {

        source.setStyle(CONFIRM_BUTTON_PRESSED_STYLE);

        if (this.selected) {
            switch (this.selectedReward.type) {
                case 'WEAPON':
                    this.character.weapon = this.selectedReward.name;
                    break;
                case 'ARMOR':
                    this.character.armor = this.selectedReward.name;
                    break;
                case 'SPECIAL':
                    this.character.specialsUsed++;
                    break;
            }
            this.selected = false;
            this.onSelected.dispatch();
        }
    };

    LevelRewardSelector.prototype.resetSelectButtonStyle = function (source) {
        source.setStyle(CONFIRM_BUTTON_STYLE);
    };

    return LevelRewardSelector;
});