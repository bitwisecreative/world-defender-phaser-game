WD.Preloader = function(game) {};

WD.Preloader.prototype = {
    preload: function() {
        this.stage.backgroundColor = '#338b22';
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'loading_text');
        var pl = this.add.sprite(0, 0, 'loading');
        this.load.setPreloadSprite(pl);

        // Screens and Buttons
        this.load.image('main_menu', 'img/main_menu.png');
        this.load.image('game_over', 'img/game_over.png');
        this.load.image('victory', 'img/victory.png');
        this.load.image('ui', 'img/ui.png');
        this.load.image('help', 'img/help.png');
        this.load.image('alpha', 'img/alpha.png');

        // Helps
        this.load.image('help1', 'img/help/1.png');
        this.load.image('help2', 'img/help/2.png');
        this.load.image('help3', 'img/help/3.png');
        this.load.image('help4', 'img/help/4.png');
        this.load.image('help5', 'img/help/5.png');
        this.load.image('help6', 'img/help/6.png');
        this.load.image('help7', 'img/help/7.png');
        this.load.image('help8', 'img/help/8.png');
        this.load.image('help9', 'img/help/9.png');
        this.load.image('help10', 'img/help/10.png');

        // UI Menus
        this.load.image('earth_menu', 'img/earth_menu.png');
        this.load.image('station_menu', 'img/station_menu.png');
        this.load.image('supply_menu', 'img/supply_menu.png');
        this.load.image('deploy_menu', 'img/deploy_menu.png');
        this.load.image('percentage_menu', 'img/percentage_menu.png');
        this.load.image('cancel_menu', 'img/cancel_menu.png');


        // Sprites
        this.load.image('blue_particle', 'img/sprites/blue_particle.png');
        this.load.image('red_particle', 'img/sprites/red_particle.png');
        this.load.image('blue_ship', 'img/sprites/blue_ship.png');
        this.load.image('red_ship', 'img/sprites/red_ship.png');
        this.load.image('station_hit', 'img/sprites/station_hit.png');
        this.load.image('ufo_hit', 'img/sprites/ufo_hit.png');
        this.load.image('mothership_hit', 'img/sprites/mothership_hit.png');
        this.load.image('earth_hit', 'img/sprites/earth_hit.png');
        this.load.image('station_kill', 'img/sprites/station_kill.png');
        this.load.image('ufo_kill', 'img/sprites/ufo_kill.png');
        this.load.image('earth_select', 'img/sprites/earth_select.png');
        this.load.image('station_select', 'img/sprites/station_select.png');

        // Icons
        this.load.image('def0', 'img/sprites/icons/def0.png');
        this.load.image('def1', 'img/sprites/icons/def1.png');
        this.load.image('def2', 'img/sprites/icons/def2.png');
        this.load.image('def3', 'img/sprites/icons/def3.png');
        this.load.image('tec0', 'img/sprites/icons/tec0.png');
        this.load.image('tec1', 'img/sprites/icons/tec1.png');
        this.load.image('tec2', 'img/sprites/icons/tec2.png');
        this.load.image('tec3', 'img/sprites/icons/tec3.png');
        this.load.image('wep0', 'img/sprites/icons/wep0.png');
        this.load.image('wep1', 'img/sprites/icons/wep1.png');
        this.load.image('wep2', 'img/sprites/icons/wep2.png');
        this.load.image('wep3', 'img/sprites/icons/wep3.png');
        this.load.image('spd0', 'img/sprites/icons/spd0.png');
        this.load.image('spd1', 'img/sprites/icons/spd1.png');
        this.load.image('spd2', 'img/sprites/icons/spd2.png');
        this.load.image('spd3', 'img/sprites/icons/spd3.png');

        // Audio
        //this.load.audio('bah', ['audio/bah.mp3', 'audio/bah.ogg']);

    },
    create: function() {
        this.state.start('MainMenu');
    }
};