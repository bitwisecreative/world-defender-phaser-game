WD.GameOver = function(game) {};

WD.GameOver.prototype = {
    create: function() {

        // Background
        this.add.sprite(0, 0, 'background');
        if (mothership < 0) {
            this.add.sprite(0, 0, 'victory');
        } else {
            this.add.sprite(0, 0, 'game_over');
        }

        // Button
        b_main_menu = this.add.button(148, 795, 'alpha', this.mainMenu, this);
        b_main_menu.width = 350;
        b_main_menu.height = 150;
        b_main_menu.input.useHandCursor = true;

    },

    mainMenu: function() {
        this.state.start('MainMenu');
    }
};