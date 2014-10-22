define([
    'Phaser',
], function (Phaser) {

    var DEFAULT_STYLE = {},
        DEFAULT_PRESSED_STYLE = {},
        FRAME_TEXT = '~~~~~~~';

    var StampButton = function (game, x, y, text, shouldFrame, angle, style, pressedStyle, action, context) {
        this.game = game;

        this.style = style || DEFAULT_STYLE;
        this.pressedStyle = pressedStyle || style || DEFAULT_PRESSED_STYLE;

        if (shouldFrame) {
            this.style.wordWrap = true;
            this.style.wordWrapWidth = 1;
            this.pressedStyle.wordWrap = true;
            this.pressedStyle.wordWrapWidth = 1;
        }

        text = shouldFrame ? FRAME_TEXT + ' ' + text + ' ' + FRAME_TEXT : text;

        Phaser.Text.call(this, game, x, y, text, style);

        this.anchor.setTo(0.5);
        //this.angle = angle || 0;

        //if (shouldFrame) this.y = this.y - this._height;

        if (action) {
            this.action = action;
            this.actionContext = context;

            this.inputEnabled = true;
            this.events.onInputDown.add(this.onInputDown, this);
            this.events.onInputUp.add(this.onInputUp, this);
        }
    };

    StampButton.prototype = Object.create(Phaser.Text.prototype);
    StampButton.prototype.constructor = StampButton;

    StampButton.prototype.onInputDown = function (source, event) {
        this.setStyle(this.pressedStyle)
    };

    StampButton.prototype.onInputUp = function (source, event) {
        this.setStyle(this.style);
        this.action.call(this.actionContext || this, source, event);
    };

    return StampButton;
});