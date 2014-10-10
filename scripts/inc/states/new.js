// game.party.push(character)
// game.campaign = ? map(s).pinpoints

var define = define || {};

/// currently unused, was the old level loader, without the combat

define(['Phaser'], function (New) {
    'use strict';
    var New = function (game) {
        var self = this;

        self.finished = false;
        self.music = undefined;
    };

    New.prototype = {
        preload: function () {
        },
        create: function () {

            // set screen background
            game.utils.stretchAndFitImage('new');

            var maxSlots = 3;
            var slotsTaken = 0;
            var campaignChosen = false;

            //#region add texts 

            game.add.text(20, 0, 'Choose your party\n & game campaign:', { font: '20px ' + game.utils.fontFamily });
            game.add.text(300, 40, 'Your selected party:', { font: '20px ' + game.utils.fontFamily, strokeThickness: 1 });
            game.add.text(300, 70, 'Alas, traveler! May I suggest you\nthat it shall be wise to pick at least \none melee combatant, together with\none ranged attacking party member.\n But why not more?', game.utils.styles.small);
            game.add.text(330, 170, 'Available party member slots:', game.utils.styles.small);
            var txtNumberOfSlots = game.add.text(380, 190, maxSlots, game.utils.styles.header);

            //#endregion

            // add back and start game buttons
            game.utils.createTextButton('Back', 80, 160, game.utils.styles.backButton, game.add.audio('sword'), function () {
                game.state.start('Menu', true, false);
            });
            var btnStart = game.utils.createTextButton('Start game', game.width - 160, game.height - 40, game.utils.styles.backButton, game.add.audio('gong'), function () {

                var campaign = null,
                    characters = [];

                for (var index in this.game.assets.characters) {
                    if (this.game.assets.characters[index].selected === true) {
                        characters.push(this.game.assets.characters[index]);
                    }
                };
                for (var campaignIndex in this.game.assets.campaigns) {
                    if (this.game.assets.campaigns[campaignIndex].selected === true) {
                        campaign = this.game.assets.campaigns[campaignIndex];
                        break;
                    }
                };

                game.state.start('Preloader', true, false, 'Play', { campaign: campaign, playerParty: characters });
            });
            btnStart.visible = false;

            //#region add sounds

            var soundNextCharacter = game.add.audio('page');
            var soundNextCampaign = game.add.audio('page2');
            var soundChoose = game.add.audio('swords');

            //#endregion

            var availableCharacters = [];

            // reset selected characters and campaigns (in case if returned from previous state)
            for (index in game.assets.characters) {
                game.assets.characters[index].selected = false;
                availableCharacters.push(index);
            };
            for (index in game.assets.campaigns) {
                game.assets.campaigns[index].selected = false;
            };

            //#region add characters

            var displayCharacter = function (character) {

                // update image and character properties
                if (characterImage.key != character.name) characterImage.loadTexture(character.name, 0);
                txtCharacterName.text = character.title;
                txtCharacterDesc.text = character.desc;
                txtWeaponName.text = character.weapon;
                txtHpTitle.text = 'Hp: ' + character.health;
                txtDefTitle.text = 'Def: ' + character.defense;
                txtAttTitle.text = 'Att: ' + character.attack;

                // update chosing sign
                if (character.selected) {
                    selectedChar.visible = true;
                    notSelectedChar.visible = false;
                    disabledChar.visible = false;
                } else {
                    if (slotsTaken == maxSlots) {
                        disabledChar.visible = true;
                        selectedChar.visible = false;
                        notSelectedChar.visible = false;
                    } else {
                        notSelectedChar.visible = true;
                        disabledChar.visible = false;
                        selectedChar.visible = false;
                    }
                }
            };
            
            var addPartyMember = function (character) {

                var firstSlot = new Phaser.Rectangle(520 + (slotsTaken - 1) * 180, 40, 180, 180);
                var member = game.utils.setImage(firstSlot, characterImage.generateTexture());
            };

            // fill out character sheet:
            var characterIndex = 0;
            var character = game.assets.characters[availableCharacters[characterIndex]];

            // this is a drawing area of the character sheet for calculating its size
            New.rect = new Phaser.Rectangle(165, 370, 240, 280);

            var characterImage = game.utils.setImage(New.rect, 'warrior');

            var txtCharacterName = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height - 40, '', game.utils.styles.header);
            txtCharacterName.anchor.setTo(0.5, 0);

            var txtCharacterDesc = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height - 10, '', game.utils.styles.characterSelectionContent);
            txtCharacterDesc.anchor.setTo(0.5, 0);

            var txtWeaponTitle = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 100, 'Main weapon:', game.utils.styles.characterSelectionContent);
            txtWeaponTitle.anchor.setTo(0.5, 0);

            var txtWeaponName = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 120, '', game.utils.styles.emphasized);
            txtWeaponName.anchor.setTo(0.5, 0);

            var txtHpTitle = game.add.text(characterImage.x - 15, characterImage.y + 160, '', game.utils.styles.characterSelectionContent);
            var txtDefTitle = game.add.text(characterImage.x - 15, characterImage.y + 180, '', game.utils.styles.characterSelectionContent);
            var txtAttTitle = game.add.text(characterImage.x - 15, characterImage.y + 200, '', game.utils.styles.characterSelectionContent);
             
            var createChooseButton = function (x, y, action) {
                var text = game.add.text(x, y, 'Choose', { font: '48px ' + game.utils.fontFamily, fill: '#00FF00', align: 'center' });
                text.anchor.setTo(0.5, 0.5);
                text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
                text.visible = false;
                text.inputEnabled = true;
                text.events.onInputUp.add(action, this);
                return text;
            };

            var notSelectedChar = createChooseButton(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height / 2, function () {
                soundChoose.play('', 0, game.utils.settings.sound.sfxVolume);
                game.assets.characters[availableCharacters[characterIndex]].selected = true;
                displayCharacter(game.assets.characters[availableCharacters[characterIndex]]);
                slotsTaken++;
                addPartyMember(game.assets.characters[availableCharacters[characterIndex]]);
                txtNumberOfSlots.text = maxSlots - slotsTaken;

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (campaignChosen && slotsTaken > 0);
            });

            var createChosenButton = function (x, y) {
                var text = game.add.text(x, y, '', { font: '48px ' + game.utils.fontFamily, fill: '#FF0000', align: 'center', strokeThickness: 2 });
                text.text = '~~~~~~~\nChosen\n~~~~~~~';
                text.angle = -45;
                text.visible = false;
                return text;
            };

            var selectedChar = createChosenButton(characterImage.x - 20, characterImage.y + characterImage.height / 2);

            var createDisabledButton = function (x, y, title) {
                var text = game.add.text(x, y, '', { font: '32px ' + game.utils.fontFamily, fill: '#888888', align: 'center', strokeThickness: 2 });
                text.text = '~~~~~~~\n' + title + '\n~~~~~~~';
                text.angle = -45;
                text.visible = false;
                return text;
            };

            var disabledChar = createDisabledButton(characterImage.x - 20, characterImage.y + characterImage.height / 2 + 40, 'Max party limit\nreached');

            New.arrow = game.utils.setImage(new Phaser.Rectangle(characterImage.x + characterImage.width, characterImage.y + characterImage.height / 2, 40, 40), 'arrow');
            New.arrow.inputEnabled = true;
            New.arrow.events.onInputUp.add(function () {
                soundNextCharacter.play('', 0, game.utils.settings.sound.sfxVolume);
                if (characterIndex >= availableCharacters.length - 1) {
                    characterIndex = 0;
                } else {
                    characterIndex++;
                }
                displayCharacter(game.assets.characters[availableCharacters[characterIndex]]);
            }, this);
        
            displayCharacter(game.assets.characters[availableCharacters[characterIndex]]);

            //#endregion

            //#region add campaigns

            // fill out campaign sheet:
            var campaignIndex = 0;
            var campaign = game.assets.campaigns[campaignIndex];

            var displayCampaign = function (campaign) {

                // update image and campaign properties
                if (campaignImage.key != campaign.name) campaignImage.loadTexture(campaign.name, 0);
                campaignName.text = campaign.title;
                campaignDesc.text = campaign.descShort;
                difficulty.text = campaign.difficulty;

                // update chosing sign
                selectedCampaign.visible = campaign.selected;
                notSelectedCampaign.visible = !campaign.selected;
            };

            // this is a drawing area of the campaign sheet for calculating its size
            New.rect2 = new Phaser.Rectangle(690, 340, 380, 320);

            var campaignImage = game.utils.fitImage(New.rect2, game.assets.campaigns[0].name);

            var campaignName = game.add.text(campaignImage.x + campaignImage.width / 2, campaignImage.y - 5, '', game.utils.styles.header);
            campaignName.anchor.setTo(0.5, 0.5);

            var campaignDesc = game.add.text(campaignImage.x + campaignImage.width / 2, campaignImage.y + campaignImage.height + 50, '', game.utils.styles.normal);
            campaignDesc.anchor.setTo(0.5, 0.5);

            game.add.text(campaignImage.x - 80, campaignImage.y + campaignImage.height - 60, 'Difficulty:', game.utils.styles.normal);
            var difficulty = game.add.text(campaignImage.x - 80, campaignImage.y + campaignImage.height - 40, '', game.utils.styles.emphasized);

            New.arrow2 = game.utils.setImage(new Phaser.Rectangle(campaignImage.x + campaignImage.width + 40, campaignImage.y + campaignImage.height / 2, 40, 40), 'arrow');
            New.arrow2.inputEnabled = true;
            New.arrow2.events.onInputUp.add(function () {
                soundNextCampaign.play('', 0, game.utils.settings.sound.sfxVolume);
                if (campaignIndex >= game.assets.campaigns.length - 1) {
                    campaignIndex = 0;
                } else {
                    campaignIndex++;
                }
                displayCampaign(game.assets.campaigns[campaignIndex]);
            }, this);

            var selectedCampaign = createChosenButton(campaignImage.x - 20, campaignImage.y + campaignImage.height / 2 + 20);

            var notSelectedCampaign = createChooseButton(campaignImage.x + campaignImage.width / 2, campaignImage.y + campaignImage.height / 2, function () {
                soundChoose.play('', 0, game.utils.settings.sound.sfxVolume);

                for (index in game.assets.campaigns) {
                    game.assets.campaigns[index].selected = false;
                };
                game.assets.campaigns[campaignIndex].selected = true;
                displayCampaign(game.assets.campaigns[campaignIndex]);
                campaignChosen = true;

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (campaignChosen && slotsTaken > 0);
            });

            displayCampaign(campaign);

            //#endregion 
        },
        update: function () {
            if (this.finished == true && this.music.volume > 0) {
                this.music.volume -= 0.01;
            }
        },
        render: function () {
        }
    };

    return New;
});