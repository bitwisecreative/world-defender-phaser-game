WD.Help = function(game) {};

WD.Help.prototype = {

    create: function() {
        this.add.sprite(0, 0, 'background');
        help = this.add.sprite(0, 0, 'help1');

        curHelp = 1;
        helpTot = 10;

        b_menu = this.add.button(11, 847, 'alpha', this.backMenu, this);
        b_menu.width = 292;
        b_menu.height = 100;
        b_menu.input.useHandCursor = true;

        b_next = this.add.button(337, 847, 'alpha', this.nextHelp, this);
        b_next.width = 292;
        b_next.height = 100;
        b_next.input.useHandCursor = true;
    },

    backMenu: function() {
        this.state.start('MainMenu');
    },

    nextHelp: function() {
        curHelp += 1;
        if (curHelp > helpTot) {
            this.backMenu();
        } else {
            help.loadTexture('help' + curHelp.toString());
            b_menu.bringToTop();
            b_next.bringToTop();
        }
    }

};
