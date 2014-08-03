// game.party.push(character)
// game.campaign = ? map(s).pinpoints

var app = app || {},
    define = define || {};

/// currently unused, was the old level loader, without the combat

define("New", ['Phaser'], function (New) {
    'use strict';
    app.New = function (game) {
        this.game = game;
    };

    app.New.prototype = {
        preload: function () {
        },
        create: function () {

            game.physics.startSystem(Phaser.Physics.ARCADE);

            // set screen background
            game.utils.stretchAndFitImage('new');

            // add texts 
            var title = game.add.text(20, 0, 'Choose your party\n & game campaign:', { font: '24px Colonna MT' });
            var partyTitle = game.add.text(340, 40, 'Your selected party:', { font: '18px Colonna MT', strokeThickness: 1 });
            var title = game.add.text(320, 80, 'It would be wise to pick at least one\nmelee combatant, together with\none ranged attacking party member.\nAnd why not more?', { font: '14px Colonna MT' });
            var title = game.add.text(320, 160, 'Available party member slots:', { font: '14px Colonna MT' });
            var title = game.add.text(380, 175, '3/3', { font: '24px Colonna MT', strokeThickness: 1 });

            var soundNextCharacter = game.add.audio('page');
            var soundNextCampaign = game.add.audio('page2');

            var displayCharacter = function (character) {
                if (characterImage.key != character.name) characterImage.loadTexture(character.name, 0);
                characterName.text = character.title;
                characterDesc.text = character.desc;
                weapon.text = character.weapon;
                hpTitle.text = 'Hp: ' + character.hp;
                acTitle.text = 'Ac: ' + character.ac;
                attTitle.text = 'Att: ' + character.att;
            };
            
            var setImage = function (area, image) {
                var asset = game.add.sprite(area.x, area.y, image);
                var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                asset.scale.setTo(ratio, ratio);
                return asset;
            };

            // fill out character sheet:
            var characterIndex = 0;
            var character = game.assets.characters[characterIndex];

            // this is a drawing area of the character sheet for calculating its size
            app.New.rect = new Phaser.Rectangle(165, 380, 240, 280);

            var characterImage = setImage(app.New.rect, 'warrior');

            var characterName = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 5, '', { font: '24px Colonna MT', strokeThickness: 1 });
            characterName.anchor.setTo(0.5, 0.5);

            var characterDesc = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 50, '', { font: '16px Colonna MT', align: 'center' });
            characterDesc.anchor.setTo(0.5, 0.5);

            var weaponTitle = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 100, 'Main weapon:', { font: '16px Colonna MT' });
            weaponTitle.anchor.setTo(0.5, 0.5);

            var weapon = game.add.text(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 120, '', { font: '18px Colonna MT', strokeThickness: 1 });
            weapon.anchor.setTo(0.5, 0.5);

            var hpTitle = game.add.text(characterImage.x - 15, characterImage.y + 160, '', { font: '16px Colonna MT' });
            var acTitle = game.add.text(characterImage.x - 15, characterImage.y + 180, '', { font: '16px Colonna MT' });
            var attTitle = game.add.text(characterImage.x - 15, characterImage.y + 200, '', { font: '16px Colonna MT' });

            app.New.arrow = setImage(new Phaser.Rectangle(characterImage.x + characterImage.width, characterImage.y + characterImage.height / 2, 40, 40), 'arrow');
            app.New.arrow.inputEnabled = true;
            app.New.arrow.events.onInputUp.add(function () {
                soundNextCharacter.play();
                if (characterIndex >= game.assets.characters.length - 1) {
                    characterIndex = 0;
                } else {
                    characterIndex++;
                }
                displayCharacter(game.assets.characters[characterIndex]);
            }, this);

            var chooseCharacter = game.add.sprite(characterImage.x + characterImage.width / 2, characterImage.y + characterImage.height + 140, 'button'); 
            chooseCharacter.anchor.setTo(0.5, 0.5);

            displayCharacter(character);

            game.physics.enable(app.New.arrow, Phaser.Physics.ARCADE);

            // fill out campaign sheet:
            var campaignIndex = 0;
            var campaign = game.assets.campaigns[campaignIndex];

            var displayCampaign = function (campaign) {
                if (campaignImage.key != campaign.name) campaignImage.loadTexture(campaign.name, 0);
                campaignName.text = campaign.title;
                campaignDesc.text = campaign.descShort;
                difficulty.text = campaign.difficulty;
            };

            // this is a drawing area of the campaign sheet for calculating its size
            app.New.rect2 = new Phaser.Rectangle(690, 340, 380, 320);

            var campaignImage = game.utils.fitImage(app.New.rect2, 'campaign-goblins-keep');

            var campaignName = game.add.text(campaignImage.x + campaignImage.width / 2, campaignImage.y - 5, '', { font: '24px Colonna MT', fill: '#7F0000', strokeThickness: 1 });
            campaignName.anchor.setTo(0.5, 0.5);

            var campaignDesc = game.add.text(campaignImage.x + campaignImage.width / 2, campaignImage.y + campaignImage.height + 50, '', { font: '16px Colonna MT', fill: '#7F0000', align: 'center' });
            campaignDesc.anchor.setTo(0.5, 0.5);

            var difficultyTitle = game.add.text(campaignImage.x - 80, campaignImage.y + campaignImage.height - 40, 'Difficulty:', { font: '16px Colonna MT', fill: '#7F0000' });
            var difficulty = game.add.text(campaignImage.x - 80, campaignImage.y + campaignImage.height - 25, '', { font: '16px Colonna MT', strokeThickness: 1, fill: '#7F0000' });

            displayCampaign(campaign);

            app.New.arrow2 = setImage(new Phaser.Rectangle(campaignImage.x + campaignImage.width + 40, campaignImage.y + campaignImage.height / 2, 40, 40), 'arrow');
            app.New.arrow2.inputEnabled = true;
            app.New.arrow2.events.onInputUp.add(function () {
                soundNextCampaign.play();
                if (campaignIndex >= game.assets.campaigns.length - 1) {
                    campaignIndex = 0;
                } else {
                    campaignIndex++;
                }
                displayCampaign(game.assets.campaigns[campaignIndex]);
            }, this);
        },
        update: function () {
            //app.New.arrow.body.angularAcceleration = 0;
            //app.New.arrow.body.angularAcceleration -= 200;

            //app.New.arrow.angle += 6;
        },
        render: function () {
            //game.debug.spriteInfo(app.New.arrow, 32, 32);

            //game.debug.geom(app.New.rect2, '#0fffff');
        }
    };
});