/*globals define*/

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
            this.characterIndex = 0;

            this.campaignChosen = false;

            //#region add texts 

            this.game.add.text(20, 0, 'Choose your party\n & game campaign:', { font: '20px ' + this.game.utils.fontFamily });
            this.game.add.text(300, 40, 'Your selected party:', { font: '20px ' + this.game.utils.fontFamily, strokeThickness: 1 });
            this.game.add.text(300, 70, 'Alas, traveler! May I suggest you\nthat it shall be wise to pick at least \none melee combatant, together with\none ranged attacking party member.\n But why not more?', this.game.utils.styles.small);
            this.game.add.text(330, 170, 'Available party member slots:', this.game.utils.styles.small);
            this.txtNumberOfSlots = this.game.add.text(380, 190, this.maxSlots, this.game.utils.styles.header);

            //#endregion

            // add back and start game buttons
            this.game.utils.createTextButton(this.game, 'Back', 80, 160, this.game.utils.styles.backButton, this.game.utils.soundsets.sword, function () {
                this.game.state.start('Menu', true, false);
            }.bind(this));
            var btnStart = this.game.utils.createTextButton(this.game, 'Start game', this.game.width - 160, this.game.height - 40, this.game.utils.styles.backButton, this.game.add.audio('gong'), this.startGame.bind(this));
            btnStart.visible = false;

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
            var character = this.game.assets.characters[availableCharacters[this.characterIndex]];

            // this is a drawing area of the character sheet for calculating its size
            New.rect = new Phaser.Rectangle(165, 370, 240, 280);

            this.characterImage = this.game.utils.setImage(this.game, New.rect, 'warrior');

            this.txtCharacterName = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height - 40, '', this.game.utils.styles.header);
            this.txtCharacterName.anchor.setTo(0.5, 0);

            this.txtCharacterDesc = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height - 10, '', this.game.utils.styles.characterSelectionContent);
            this.txtCharacterDesc.anchor.setTo(0.5, 0);

            this.txtSpecialityTitle = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height + 100, 'Speciality:', this.game.utils.styles.characterSelectionContent);
            this.txtSpecialityTitle.anchor.setTo(0.5, 0);

            this.txtSpecialityName = this.game.add.text(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height + 120, '', this.game.utils.styles.emphasized);
            this.txtSpecialityName.anchor.setTo(0.5, 0);

            this.txtHpTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 160, '', this.game.utils.styles.characterSelectionContent);
            this.txtDefTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 180, '', this.game.utils.styles.characterSelectionContent);
            this.txtAttTitle = this.game.add.text(this.characterImage.x - 15, this.characterImage.y + 200, '', this.game.utils.styles.characterSelectionContent);

            this.members = [];

            this.notSelectedChar = this.createChooseButton(this.characterImage.x + this.characterImage.width / 2, this.characterImage.y + this.characterImage.height / 2, function () {
                this.game.utils.soundsets.select.play();
                this.game.assets.characters[availableCharacters[this.characterIndex]].selected = true;
                this.displayCharacter(this.game.assets.characters[availableCharacters[this.characterIndex]]);
                this.addPartyMember(this.game.assets.characters[availableCharacters[this.characterIndex]]);

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (this.campaignChosen && this.members.length > 0);
            });

            this.selectedChar = this.createChosenButton(this.characterImage.x - 20, this.characterImage.y + this.characterImage.height / 2);

            this.disabledChar = this.createDisabledButton(this.characterImage.x - 20, this.characterImage.y + this.characterImage.height / 2 + 40, 'Max party limit\nreached');

            var charUp = this.game.add.sprite(370, 440, 'arrows', 2);
            charUp.scale.setTo(0.8, 0.8);
            charUp.inputEnabled = true;
            charUp.events.onInputUp.add(function () {
                this.game.utils.soundsets.page.play();
                if (this.characterIndex === 0) {
                    this.characterIndex = availableCharacters.length - 1;
                } else {
                    this.characterIndex--;
                }
                this.displayCharacter(this.game.assets.characters[availableCharacters[this.characterIndex]]);
            }, this);
            var charDown = this.game.add.sprite(370, 520, 'arrows', 3);
            charDown.scale.setTo(0.8, 0.8);
            charDown.inputEnabled = true;
            charDown.events.onInputUp.add(function () {
                this.game.utils.soundsets.page.play();
                if (this.characterIndex === availableCharacters.length - 1) {
                    this.characterIndex = 0;
                } else {
                    this.characterIndex++;
                }
                this.displayCharacter(this.game.assets.characters[availableCharacters[this.characterIndex]]);
            }, this);

            this.displayCharacter(this.game.assets.characters[availableCharacters[this.characterIndex]]);

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

            var campUp = this.game.add.sprite(1000, 440, 'arrows', 2);
            campUp.scale.setTo(0.8, 0.8);
            campUp.inputEnabled = true;
            campUp.events.onInputUp.add(function () {
                this.game.utils.soundsets.page.play();
                if (campaignIndex === 0) {
                    campaignIndex = this.game.assets.campaigns.length - 1;
                } else {
                    campaignIndex--;
                }
                this.displayCampaign(this.game.assets.campaigns[campaignIndex]);
            }, this);
            var campDown = this.game.add.sprite(1000, 520, 'arrows', 3);
            campDown.scale.setTo(0.8, 0.8);
            campDown.inputEnabled = true;
            campDown.events.onInputUp.add(function () {
                this.game.utils.soundsets.page.play();
                if (campaignIndex === this.game.assets.campaigns.length - 1) {
                    campaignIndex = 0;
                } else {
                    campaignIndex++;
                }
                this.displayCampaign(this.game.assets.campaigns[campaignIndex]);
            }, this);

            this.selectedCampaign = this.createChosenButton(this.campaignImage.x - 20, this.campaignImage.y + this.campaignImage.height / 2 + 20);

            this.notSelectedCampaign = this.createChooseButton(this.campaignImage.x + this.campaignImage.width / 2, this.campaignImage.y + this.campaignImage.height / 2, function () {
                this.game.utils.soundsets.select.play();

                for (var index in this.game.assets.campaigns) {
                    this.game.assets.campaigns[index].selected = false;
                }
                this.game.assets.campaigns[campaignIndex].selected = true;
                this.displayCampaign(this.game.assets.campaigns[campaignIndex]);
                this.campaignChosen = true;

                // check whether the conditions for starting game are fulfilled 
                btnStart.visible = (this.campaignChosen && this.members.length > 0);
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
        var text = this.game.add.text(x, y, 'Choose', { font: '48px ' + this.game.utils.fontFamily, fill: '#00FF00', align: 'center', stroke: '#000000', strokeThickness: 2 });
        text.anchor.setTo(0.5, 0.5);
        text.visible = false;
        text.inputEnabled = true;
        text.events.onInputUp.add(action, this);
        return text;
    };

    New.prototype.createChosenButton = function (x, y) {
        var text = this.game.add.text(x, y, '', { font: '48px ' + this.game.utils.fontFamily, fill: '#FF0000', align: 'center', stroke: '#000000', strokeThickness: 2 });
        text.text = '~~~~~~~\nChosen\n~~~~~~~';
        text.angle = -45;
        text.visible = false;
        return text;
    };

    New.prototype.createDisabledButton = function (x, y, title) {
        var text = this.game.add.text(x, y, '', { font: '32px ' + this.game.utils.fontFamily, fill: '#888888', align: 'center', stroke: '#000000', strokeThickness: 2 });
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

        this.game.state.start('Preloader', true, false, 'Play', { campaign: campaign, playerParty: characters, currentMapIndex: 0 });
    };

    New.prototype.removePartyMember = function (member) {
        this.game.utils.soundsets.sword.play();

        //this.game.add.tween(member).to({ angle: 360 }, 400, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(member).to({ x: member.position.x + 40, y: member.position.y + 40 }, 200, Phaser.Easing.Linear.None, true);
        this.game.add.tween(member.scale).to({ x: 0.1, y: 0.1 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {

            this.members.splice(this.members.indexOf(member), 1);
            member.kill();
            this.txtNumberOfSlots.text = this.maxSlots - this.members.length;

            this.game.assets.characters[member.name].selected = false;
            this.displayCharacter(this.game.assets.characters[member.name]);
            this.characterIndex = member.index;

            // TODO: move all other party members to the left (if applied)
            if (this.members.length) {
                for (var index in this.members) {
                    var other = this.members[index];
                    var formula = 520 + index * 180;
                    if (other.position.x !== formula) {
                        this.game.add.tween(other).to({ x: formula }, 200, Phaser.Easing.Linear.None, true);
                        //other.position.x = formula;
                    }
                }
            }
        }, this);
    };

    New.prototype.addPartyMember = function (character) {
        var place = new Phaser.Rectangle(520 + this.members.length * 180, 40, 180, 180);
        var member = this.game.utils.setImage(this.game, place, this.characterImage.generateTexture());
        var tween = this.game.add.tween(member.scale).to({ x: 0.5, y: 0.5 }, 300, Phaser.Easing.Bounce.Out).start();
        member.inputEnabled = true;
        member.events.onInputUp.add(this.removePartyMember, this);
        member.name = character.name;
        member.index = this.characterIndex;

        this.members.push(member);
        this.txtNumberOfSlots.text = this.maxSlots - this.members.length;
    };

    New.prototype.displayCharacter = function (character) {

        // update image and character properties
        if (this.characterImage.key !== character.name) this.characterImage.loadTexture(character.name, 0);
        this.txtCharacterName.text = character.title;
        this.txtCharacterDesc.text = character.desc;
        this.txtSpecialityName.text = character.speciality;
        this.txtHpTitle.text = 'Hp: ' + character.health;
        this.txtDefTitle.text = 'Def: ' + character.defense;
        this.txtAttTitle.text = 'Att: ' + character.attack;

        // update chosing sign
        if (character.selected) {
            this.selectedChar.visible = true;
            this.notSelectedChar.visible = false;
            this.disabledChar.visible = false;
        } else {
            if (this.members.length === this.maxSlots) {
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