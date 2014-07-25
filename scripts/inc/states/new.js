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

            var displayCharacter = function (character) {

            };
            
            var setImage = function (area, image) {
                var asset = game.add.sprite(area.x, area.y, image);
                var ratio = Math.min(area.width / asset.width, area.height / asset.height);
                asset.scale.setTo(ratio, ratio);
                return asset;
            };

            // fill out character sheet:
            var character = game.assets.characters[0];
            displayCharacter(character);

            // this is a drawing area of the character sheet for calculating its size
            app.New.rect = new Phaser.Rectangle(160, 380, 240, 280);
            var image = setImage(app.New.rect, 'warrior');

            var characterName = game.add.text(image.x + image.width / 2, image.y + image.height + 10, 'Warrior', { font: '24px Colonna MT', strokeThickness: 1 });
            characterName.anchor.setTo(0.5, 0.5);

            var characterDesc = game.add.text(image.x + image.width / 2, image.y + image.height + 40, 'blablalballblbllallval falbla bla', { font: '16px Colonna MT' });
            characterDesc.anchor.setTo(0.5, 0.5);

            var weaponTitle = game.add.text(image.x + image.width / 2, image.y + image.height + 100, 'Main weapon:', { font: '16px Colonna MT' });
            weaponTitle.anchor.setTo(0.5, 0.5);

            var characterName = game.add.text(image.x + image.width / 2, image.y + image.height + 120, 'Two-handed axe', { font: '18px Colonna MT', strokeThickness: 1 });
            characterName.anchor.setTo(0.5, 0.5);

            var hpTitle = game.add.text(image.x - 15, image.y + 160, 'Hp: 150', { font: '16px Colonna MT' });
            var acTitle = game.add.text(image.x - 15, image.y + 180, 'Ac: 50', { font: '16px Colonna MT' });
            var atTitle = game.add.text(image.x -15, image.y + 200, 'At: 12', { font: '16px Colonna MT' });

            app.New.arrow = setImage(new Phaser.Rectangle(image.x + image.width, image.y + image.height / 2, 40, 40), 'arrow');

            game.physics.enable(app.New.arrow, Phaser.Physics.ARCADE);

        },
        update: function () {
            //app.New.arrow.body.angularAcceleration = 0;
            //app.New.arrow.body.angularAcceleration -= 200;

            //app.New.arrow.angle += 6;
        },
        render: function () {
            //game.debug.spriteInfo(app.New.arrow, 32, 32);

            //game.debug.geom(app.New.rect, '#0fffff');
        }
    };
});