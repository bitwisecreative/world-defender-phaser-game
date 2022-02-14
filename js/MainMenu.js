WD.MainMenu = function(game) {};

WD.MainMenu.prototype = {

    create: function() {

        // Screen
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'main_menu');

        // Buttons
        var b_play = this.add.button(152, 338, 'alpha', this.playGame, this);
        b_play.width = 354;
        b_play.height = 124;
        b_play.input.useHandCursor = true;
        var b_help = this.add.button(202, 504, 'alpha', this.showHelp, this);
        b_help.width = 242;
        b_help.height = 82;
        b_help.input.useHandCursor = true;

    },
    playGame: function() {
        this.state.start('Game');
    },
    showHelp: function() {
        this.state.start('Help');
    }
};