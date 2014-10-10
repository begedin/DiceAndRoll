// game.party.push(character)
// game.campaign = ? map(s).pinpoints

var define = define || {};

/// currently unused, was the old level loader, without the combat

define(['Phaser'], function (Phaser) {
    'use strict';
    var New = function (game) {
        var self = this;

        this.game = game;
        this.finished = false;
        this.music = undefined;
    };

    New.prototype = {
        preload: function () {
        },
        create: function () {

            // set screen background
            this.game.utils.stretchAndFitImage(this.game, 'new');

            this.maxSlots = 3;
            this.slotsTaken = 0;
            this.campaignChosen = false;

            //#region add texts 

            this.game.add.text(20, 0, 'Choose your party\n & game campaign:', { font: '20px ' + this.game.utils.fontFamily });
            this.game.add.text(300, 40, 'Your selected party:', { font: '20px ' + this.game.utils.fontFamily, strokeThickness: 1 });
            this.game.add.text(300, 70, 'Alas, traveler! May I suggest you\nthat it shall be wise to pick at least \none melee combatant, together with\none ranged attacking party member.\n But why not more?', this.game.utils.styles.small);
            this.game.add.text(330, 170, 'Available party member slots:', this.game.utils.styles.small);
            var txtNumberOfSlots = this.game.add.text(380, 190, this.maxSlots, this.game.utils.styles.header);

            //#endregion

            // add back and start game buttons
            this.game.utils.createTextButton(this.game, 'Back', 80, 160, this.game.utils.styles.backButton, this.game.add.audio('sword'), function () {
                this.game.state.start('Menu', true, false);
            }.bind(this));
            var btnStart = this.game.utils.createTextButton(this.game, 'Start game', this.game.width - 160, this.game.height - 40, this.game.utils.styles.backButton, this.game.add.audio('gong'), this.startGame.bind(this));
            btnStart.visible = false;

            //#region add sounds

            var soundNextCharacter = this.game.add.audio('page');
            var soundNextCampaign = this.game.add.audio('page2');
            var soundChoose = this.game.add.audio('swords');

            //#endregion

            var availableCharacters = [];

            // reset selected characters and campaigns (in case if returned from previous state)
            for (var charIndex in this.game.assets.characters) {
                this.game.assets.characters[charIndex].selected = false;
                availableCharacters.push(charIndex);
            }
            for (var campIndex in this.game.assets.campaigns) {
                this.game.assets.campaigns[campIndex].selected = false;
            }

            //#region add characters
    
            // fill out character sheet:
            var characterIndex = 0;
            var character = this.game.assets.characters[availableCharacters[characterIndex]];

            // this is a drawing area of the character sheet for calculating its size
            New.rect = new Phaser.Rectangle(165, 370, 240, 280);

            this.characterImage = this.game.utils.setImage(this.game, New.rect, 'warrior');

            this.txtCharacterName = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height - 40, '', this.game.utils.styles.header);
            this.txtCharacterName.anchor.setTo(0.5, 0);

            this.txtCharacterDesc = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height - 10, '', this.game.utils.styles.characterSelectionContent);
            this.txtCharacterDesc.anchor.setTo(0.5, 0);

            this.txtWeaponTitle = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height + 100, 'Main weapon:', this.game.utils.styles.characterSelectionContent);
            this.txtWeaponTitle.anchor.setTo(0.5, 0);

            this.txtWeaponName = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height + 120, '', this.game.utils.styles.emphasized);
            this.txtWeaponName.anchor.setTo(0.5, 0);

            this.txtHpTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 160, '', this.game.utils.styles.characterSelectionContent);
            this.txtDefTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 180, '', this.game.utils.styles.characterSelectionContent);
            this.txtAttTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 200, '', this.game.utils.styles.characterSelectionContent);

            this.notSelectedChar = this.createChooseButton(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height / 2, function () {
                soundChoose.play('', 0, this.game.utils.settings.sound.sfxVolume);
                this.game.assets.characters[availableCharacters[characterIndex]].selected = true;
                this.displayCharacter(this.game.assets.characters[availableCharacters[characterIndex]]);
                this.slotsTaken++;
                this.addPartyMember(this.game.assets.characters[availableCharacters[characterIndex]]);
                txtNumberOfSlots.text = this.maxSlots - this.slotsTaken;

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (this.campaignChosen && this.slotsTaken > 0);
            });

            this.selectedChar = this.createChosenButton(this.characterImage.x - 20, this.characterImage.y + this.characterImage.height / 2);

            this.disabledChar = this.createDisabledButton(this.characterImage.x - 20, this.characterImage.y + this.characterImage.height / 2 + 40, 'Max party limit\nreached');

            New.arrow = this.game.utils.setImage(this.game, new Phaser.Rectangle(this.characterImage.x + this.characterImage.width, this.characterImage.y + this.characterImage.height / 2, 40, 40), 'arrow');
            New.arrow.inputEnabled = true;
            New.arrow.events.onInputUp.add(function () {
                soundNextCharacter.play('', 0, this.game.utils.settings.sound.sfxVolume);
                if (characterIndex >= availableCharacters.length - 1) {
                    characterIndex = 0;
                } else {
                    characterIndex++;
                }
                this.displayCharacter(this.game.assets.characters[availableCharacters[characterIndex]]);
            }, this);
        
            this.displayCharacter(this.game.assets.characters[availableCharacters[characterIndex]]);

            //#endregion

            //#region add campaigns

            // fill out campaign sheet:
            var campaignIndex = 0;
            var campaign = this.game.assets.campaigns[campaignIndex];

            // this is a drawing area of the campaign sheet for calculating its size
            New.rect2 = new Phaser.Rectangle(690, 340, 380, 320);

            this.campaignImage = this.game.utils.fitImage(this.game, New.rect2, this.game.assets.campaigns[0].name);

            this.campaignName = this.game.add.text(this.campaignImage.x + this.campaignImage.width / 2, this.campaignImage.y - 5, '', this.game.utils.styles.header);
            this.campaignName.anchor.setTo(0.5, 0.5);

            this.campaignDesc = this.game.add.text(this.campaignImage.x + this.campaignImage.width / 2, this.campaignImage.y + this.campaignImage.height + 50, '', this.game.utils.styles.normal);
            this.campaignDesc.anchor.setTo(0.5, 0.5);

            this.game.add.text(this.campaignImage.x - 80, this.campaignImage.y + this.campaignImage.height - 60, 'Difficulty:', this.game.utils.styles.normal);
            this.difficulty = this.game.add.text(this.campaignImage.x - 80, this.campaignImage.y + this.campaignImage.height - 40, '', this.game.utils.styles.emphasized);

            New.arrow2 = this.game.utils.setImage(this.game, new Phaser.Rectangle(this.campaignImage.x + this.campaignImage.width + 40, this.campaignImage.y + this.campaignImage.height / 2, 40, 40), 'arrow');
            New.arrow2.inputEnabled = true;
            New.arrow2.events.onInputUp.add(function () {
                soundNextCampaign.play('', 0, this.game.utils.settings.sound.sfxVolume);
                if (campaignIndex >= this.game.assets.campaigns.length - 1) {
                    campaignIndex = 0;
                } else {
                    campaignIndex++;
                }
                this.displayCampaign(this.game.assets.campaigns[campaignIndex]);
            }, this);

            this.selectedCampaign = this.createChosenButton(this.campaignImage.x - 20, this.campaignImage.y + this.campaignImage.height / 2 + 20);

            this.notSelectedCampaign = this.createChooseButton(this.campaignImage.x + this.campaignImage.width / 2, this.campaignImage.y + this.campaignImage.height / 2, function () {
                soundChoose.play('', 0, this.game.utils.settings.sound.sfxVolume);

                for (var index in this.game.assets.campaigns) {
                    this.game.assets.campaigns[index].selected = false;
                }
                this.game.assets.campaigns[campaignIndex].selected = true;
                this.displayCampaign(this.game.assets.campaigns[campaignIndex]);
                this.campaignChosen = true;

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (this.campaignChosen && this.slotsTaken > 0);
            });

            this.displayCampaign(campaign);

            //#endregion 
        },
        update: function () {
            if (this.finished === true && this.music.volume > 0) {
                this.music.volume -= 0.01;
            }
        },
        render: function () {
        }
    };

    New.prototype.createChooseButton = function (x, y, action) {
        var text = this.game.add.text(x, y, 'Choose', { font: '48px ' + this.game.utils.fontFamily, fill: '#00FF00', align: 'center' });
        text.anchor.setTo(0.5, 0.5);
        text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        text.visible = false;
        text.inputEnabled = true;
        text.events.onInputUp.add(action, this);
        return text;
    };

    New.prototype.createChosenButton = function (x, y) {
        var text = this.game.add.text(x, y, '', { font: '48px ' + this.game.utils.fontFamily, fill: '#FF0000', align: 'center', strokeThickness: 2 });
        text.text = '~~~~~~~\nChosen\n~~~~~~~';
        text.angle = -45;
        text.visible = false;
        return text;
    };

    New.prototype.createDisabledButton = function (x, y, title) {
        var text = this.game.add.text(x, y, '', { font: '32px ' + this.game.utils.fontFamily, fill: '#888888', align: 'center', strokeThickness: 2 });
        text.text = '~~~~~~~\n' + title + '\n~~~~~~~';
        text.angle = -45;
        text.visible = false;
        return text;
    };

    New.prototype.displayCampaign = function (campaign) {

        // update image and campaign properties
        if (this.campaignImage.key !== campaign.name) this.campaignImage.loadTexture(campaign.name, 0);
        this.campaignName.text = campaign.title;
        this.campaignDesc.text = campaign.descShort;
        this.difficulty.text = campaign.difficulty;

        // update chosing sign
        this.selectedCampaign.visible = campaign.selected;
        this.notSelectedCampaign.visible = !campaign.selected;
    };

    New.prototype.startGame = function () {
        var campaign = null,
            characters = [];

        for (var index in this.game.assets.characters) {
            if (this.game.assets.characters[index].selected === true) {
                characters.push(this.game.assets.characters[index]);
            }
        }
        for (var campaignIndex in this.game.assets.campaigns) {
            if (this.game.assets.campaigns[campaignIndex].selected === true) {
                campaign = this.game.assets.campaigns[campaignIndex];
                break;
            }
        }

        this.game.state.start('Preloader', true, false, 'Play', { campaign: campaign, playerParty: characters });
    };

    New.prototype.addPartyMember = function (character) {
        var firstSlot = new Phaser.Rectangle(520 + (this.slotsTaken - 1) * 180, 40, 180, 180);
        var member = this.game.utils.setImage(this.game, firstSlot, this.characterImage.generateTexture());
    };

    New.prototype.displayCharacter = function (character) {

        // update image and character properties
        if (this.characterImage.key !== character.name) this.characterImage.loadTexture(character.name, 0);
        this.txtCharacterName.text = character.title;
        this.txtCharacterDesc.text = character.desc;
        this.txtWeaponName.text = character.weapon;
        this.txtHpTitle.text = 'Hp: ' + character.health;
        this.txtDefTitle.text = 'Def: ' + character.defense;
        this.txtAttTitle.text = 'Att: ' + character.attack;

        // update chosing sign
        if (character.selected) {
            this.selectedChar.visible = true;
            this.notSelectedChar.visible = false;
            this.disabledChar.visible = false;
        } else {
            if (this.slotsTaken === this.maxSlots) {
                this.disabledChar.visible = true;
                this.selectedChar.visible = false;
                this.notSelectedChar.visible = false;
            } else {
                this.notSelectedChar.visible = true;
                this.disabledChar.visible = false;
                this.selectedChar.visible = false;
            }
        }
    };

    return New;
});