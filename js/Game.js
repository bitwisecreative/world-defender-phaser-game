WD.Game = function(game) {};

WD.Game.prototype = {

    // PHASER CREATE
    create: function() {


        ///////////////////////////////////////////////////////////////////////
        // CONFIGS
        tick = 60; // Frames

        shipsPerTick = 20;

        shipCombat = true;

        mothershipStart = 300;
        ufoStart = 30;

        earthStart = 100;
        stationStart = 10;

        spawnRate = 1; // Per tick
        enemySpawnRate = 3;
        spawnBonus = .005;

        speedStart = .2; // per frame
        enemySpeed = .6;

        maxUpgrade = 3;
        defCost = [20, 40, 80];
        tecCost = [20, 40, 80];
        wepCost = [10, 20, 40];
        spdCost = [10, 20, 40];

        tecBonus = 1; // Added to spawnRate

        aiPlans = {
            random_attack_freq: 25, // percentage out of 100
            aggressive: true,
            mass_attack: true,
            mass_attack_ufo: -1,
            mass_attack_freq: 1,
            mass_attack_freq_of: 120,
            mass_attack_building: false,
            mass_attack_in_effect: false,
            mass_attack_build_frames: 1200,
            mass_attack_build_frame_start: -1,
            limit_break: true,
            limit_break_freq: 1,
            limit_break_freq_of: 120,
            limit_break_spd: 1,
            limit_break_spawn: 5,
            limit_break_random_attack_freq: 100
        };
        ///////////////////////////////////////////////////////////////////////


        // RUNTIMES
        f = 0;
        debugging = false;
        earth = earthStart;
        stations = [stationStart, stationStart, stationStart, stationStart, stationStart];
        mothership = mothershipStart;
        ufos = [ufoStart, ufoStart, ufoStart, ufoStart, ufoStart];
        def = 0;
        tec = 0;
        spds = [0, 0, 0, 0, 0];
        weps = [0, 0, 0, 0, 0];
        selection = null;
        percentages = [10, 25, 50, 75, 99];
        menu = null;
        menuButtons = [];
        menuText = [];
        deadStations = [];
        deadUfos = [];
        supplyOrders = [];
        supplyShips = [];
        deployOrders = [];
        deployShips = [];
        hits = [];
        aiAttacks = [];
        aiSupply = [];

        centerX = this.world.centerX;
        centerY = this.world.centerY;

        // UI
        this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'ui');

        // Sounds
        sounds = new Array();
        //sounds['bah'] = this.add.audio('bah');

        // Text loc values (also used elsewhere in game positioning)
        t_xCenters = [62, 194, 319, 449, 576];
        t_yValsStations = [643, 589, 557, 589, 643];
        t_yValsUfos = [151, 204, 238, 204, 151];
        t_yValsMothership = [30, 97, 164, 97, 30];
        t_yValsEarth = [743, 676, 660, 676, 743];

        // Killed Sprites
        for (var i = 0; i < 5; i++) {
            var ds = this.add.sprite(t_xCenters[i] - 42, t_yValsStations[i] - 43, 'station_kill');
            ds.oloc = [ds.x, ds.y];
            this.hide(ds);
            deadStations.push(ds);
            var du = this.add.sprite(t_xCenters[i] - 42, t_yValsUfos[i] - 43, 'ufo_kill');
            du.oloc = [du.x, du.y];
            this.hide(du);
            deadUfos.push(du);
        }

        // Text
        t_font = 'Consolas, monaco, monospace';

        t_earth = this.add.text(centerX, 690, earth.toString(), { font: '40px ' + t_font, fill: '#ffffff' });
        this.centerText(t_earth, centerX);

        t_stations = [];
        for (var i = 0; i < 5; i++) {
            var t = this.add.text(0, 0, '', { font: '30px ' + t_font, fill: '#ffffff' });
            t.text = stations[i].toString();
            t.y = t_yValsStations[i] - 16;
            this.centerText(t, t_xCenters[i]);
            t_stations.push(t);
        }

        t_mothership = this.add.text(centerX, 40, mothership.toString(), { font: '40px ' + t_font, fill: '#ffffff' });
        this.centerText(t_mothership, centerX);

        t_ufos = [];
        for (var i = 0; i < 5; i++) {
            var t = this.add.text(0, 0, '', { font: '30px ' + t_font, fill: '#ffffff' });
            t.text = ufos[i].toString();
            t.y = t_yValsUfos[i] - 16;
            this.centerText(t, t_xCenters[i]);
            t_ufos.push(t);
        }

        t_debug_loc = [-9999, -9999];
        if (debugging) {
            t_debug_loc = [12, 100];
        }
        t_debug = this.add.text(t_debug_loc[0], t_debug_loc[1], '', { font: '16px "consolas"', fill: '#ffffff' });

        // Icons
        defIcon = this.add.sprite(100, 730, 'def' + def.toString());
        tecIcon = this.add.sprite(390, 730, 'tec' + tec.toString());
        spdIcons = [];
        for (var i = 0; i < 5; i++) {
            var si = this.add.sprite(t_xCenters[i] - 28, t_yValsStations[i] - 36, 'spd' + spds[i].toString());
            spdIcons.push(si);
        }
        wepIcons = [];
        for (var i = 0; i < 5; i++) {
            var wi = this.add.sprite(t_xCenters[i] - 34, t_yValsStations[i] + 18, 'wep' + weps[i].toString());
            wepIcons.push(wi);
        }

        // Buttons
        b_earth1 = this.add.button(0, 697, 'alpha', this.clickEarth, this);
        b_earth1.width = 640;
        b_earth1.height = 100;
        b_earth1.input.useHandCursor = true;
        b_earth2 = this.add.button(144, 656, 'alpha', this.clickEarth, this);
        b_earth2.width = 357;
        b_earth2.height = 55;
        b_earth2.input.useHandCursor = true;

        b_stations = [];
        for (var i = 0; i < 5; i++) {
            var b = this.add.button(t_xCenters[i] - 41, t_yValsStations[i] - 41, 'alpha', this.clickStation, this);
            b.width = 82;
            b.height = 82;
            b.station = i;
            b.input.useHandCursor = true;
            b_stations.push(b);
        }
    },


    // UPDATE
    ///////////////////////////////////////////////////////////////////////////
    update: function() {

        // Inc frame
        f += 1;

        // Game Over
        if (earth < 0 || mothership < 0) {
            this.state.start('GameOver');
        }

        // Tick
        if (f % tick == 0) {
            // Spawns
            earth += this.getSpawn(earth);
            mothership += this.getEnemySpawn(mothership);
            for (var i = 0; i < 5; i++) {
                if (stations[i] >= 0) {
                    stations[i] += this.getSpawn(stations[i]);
                }
                if (ufos[i] >= 0) {
                    ufos[i] += this.getEnemySpawn(ufos[i]);
                }
            }
            // Menus
            if (menu != null) {
                switch (menu.key) {
                    case 'earth_menu':
                        this.earthMenu();
                        break;
                    case 'station_menu':
                        this.stationMenu({station: menu.station});
                        break;
                    case 'cancel_menu':
                        if (menu.name == 'supply_percentage_menu') {
                            this.supplyPercentageMenu({station: menu.station});
                        }
                        if (menu.name == 'deploy_menu') {
                            this.deployMenu({station: menu.station});
                        }
                        break;
                }
            }
            // Supply Orders
            // (need to iterate in reverse for cancelled orders
            var i = supplyOrders.length;
            while (i--) {
                // Cancel order?
                if (supplyOrders[i].supply > earth) {
                    supplyOrders.splice(i, 1);
                    continue;
                }
                // End of shipment?
                if (supplyOrders[i].supply <= shipsPerTick) {
                    earth -= supplyOrders[i].supply;
                    this.sendSupply(supplyOrders[i].supply, supplyOrders[i].station);
                    supplyOrders.splice(i, 1);
                    continue;
                }
                // Send standard supply
                supplyOrders[i].supply -= shipsPerTick;
                earth -= shipsPerTick;
                this.sendSupply(shipsPerTick, supplyOrders[i].station);
            }
            // Deploy Orders
            // (need to iterate in reverse for cancelled orders
            var i = deployOrders.length;
            while (i--) {
                // Cancel order?
                if (deployOrders[i].deploy > stations[deployOrders[i].station]) {
                    deployOrders.splice(i, 1);
                    continue;
                }
                // End of deployment?
                if (deployOrders[i].deploy <= shipsPerTick) {
                    stations[deployOrders[i].station] -= deployOrders[i].deploy;
                    this.sendDeployment(deployOrders[i].deploy, deployOrders[i].station, deployOrders[i].target);
                    deployOrders.splice(i, 1);
                    continue;
                }
                // Send standard supply
                deployOrders[i].deploy -= shipsPerTick;
                stations[deployOrders[i].station] -= shipsPerTick;
                this.sendDeployment(shipsPerTick, deployOrders[i].station, deployOrders[i].target);
            }
            // Run Enemy AI
            this.ai();
        }

        // Supply Ships
        // (again, iterating in reverse in order to remove them)
        var i = supplyShips.length;
        while (i--) {
            supplyShips[i].y -= speedStart * (spds[supplyShips[i].station] + 1);
            if (supplyShips[i].y < t_yValsStations[supplyShips[i].station] + 30) {
                if (stations[supplyShips[i].station] < 0) {
                    stations[supplyShips[i].station] += supplyShips[i].supply;
                    if (stations[supplyShips[i].station] >= 0) {
                        this.hide(deadStations[supplyShips[i].station]);
                    }
                } else {
                    stations[supplyShips[i].station] += supplyShips[i].supply;
                }
                supplyShips[i].kill();
                supplyShips.splice(i, 1);
                continue;
            }
        }

        // Deploy Ships
        // (again, iterating in reverse in order to remove them)
        var i = deployShips.length;
        while (i--) {
            deployShips[i].y -= speedStart * (spds[deployShips[i].station] + 1);
            if (deployShips[i].target == 'ufo') {
                if (deployShips[i].y < t_yValsUfos[deployShips[i].station] + 30) {
                    var deadUfoDmg = 1;
                    if (ufos[deployShips[i].station] < 0) {
                        deadUfoDmg = 2;
                    }
                    ufos[deployShips[i].station] -= deployShips[i].deploy * (weps[deployShips[i].station] + 1) * deadUfoDmg;
                    if (ufos[deployShips[i].station] < 0) {
                        deadUfos[deployShips[i].station].x = deadUfos[deployShips[i].station].oloc[0];
                        deadUfos[deployShips[i].station].y = deadUfos[deployShips[i].station].oloc[1];
                    }
                    hits.push(this.add.sprite(t_xCenters[deployShips[i].station] - 43, t_yValsUfos[deployShips[i].station] - 43, 'ufo_hit'));
                    deployShips[i].kill();
                    deployShips.splice(i, 1);
                    continue;
                }
            } else {
                if (deployShips[i].y < t_yValsMothership[deployShips[i].station]) {
                    var mothershipDef = this.getActiveUfos() + 1;
                    mothership -= Math.round(deployShips[i].deploy * (weps[deployShips[i].station] + 1) / mothershipDef);
                    hits.push(this.add.sprite(0, 0, 'mothership_hit'));
                    deployShips[i].kill();
                    deployShips.splice(i, 1);
                    continue;
                }
            }
        }

        // AI Supply Ships
        var i = aiSupply.length;
        while (i--) {
            aiSupply[i].y += enemySpeed;
            if (aiSupply[i].y > t_yValsUfos[aiSupply[i].station] - 40) {
                if (ufos[aiSupply[i].station] < 0) {
                    ufos[aiSupply[i].station] += aiSupply[i].supply;
                    if (ufos[aiSupply[i].station] >= 0) {
                        this.hide(deadUfos[aiSupply[i].station]);
                    }
                } else {
                    ufos[aiSupply[i].station] += aiSupply[i].supply;
                }
                aiSupply[i].kill();
                aiSupply.splice(i, 1);
                continue;
            }
        }

        // AI Attack Ships
        var i = aiAttacks.length;
        while (i--) {
            aiAttacks[i].y += enemySpeed;
            if (aiAttacks[i].y > t_yValsStations[aiAttacks[i].station] - 40) {
                // Earth?
                if (stations[aiAttacks[i].station] < 0) {
                    if (aiAttacks[i].y > t_yValsEarth[aiAttacks[i].station] + 2) {
                        earth -= Math.round(aiAttacks[i].attack / (def + 1));
                        hits.push(this.add.sprite(0, 654, 'earth_hit'));
                        aiAttacks[i].kill();
                        aiAttacks.splice(i, 1);
                        continue;
                    }
                } else {
                    stations[aiAttacks[i].station] -= Math.round(aiAttacks[i].attack / (def + 1));
                    if (stations[aiAttacks[i].station] < 0) {
                        deadStations[aiAttacks[i].station].x = deadStations[aiAttacks[i].station].oloc[0];
                        deadStations[aiAttacks[i].station].y = deadStations[aiAttacks[i].station].oloc[1];
                        spds[aiAttacks[i].station] = 0;
                        spdIcons[aiAttacks[i].station].loadTexture('spd' + spds[aiAttacks[i].station].toString());
                        weps[aiAttacks[i].station] = 0;
                        wepIcons[aiAttacks[i].station].loadTexture('wep' + weps[aiAttacks[i].station].toString());
                    }
                    hits.push(this.add.sprite(t_xCenters[aiAttacks[i].station] - 40, t_yValsStations[aiAttacks[i].station] - 40, 'station_hit'));
                    aiAttacks[i].kill();
                    aiAttacks.splice(i, 1);
                    continue;
                }
            }
        }

        // Ship Combat
        if (shipCombat) {
            var i = deployShips.length;
            while (i--) {
                var sid = deployShips[i].station;
                var j = aiAttacks.length;
                while (j--) {
                    if (aiAttacks[j].station == sid) {
                        if (aiAttacks[j].y >= deployShips[i].y) {
                            var h = this.add.sprite(deployShips[i].x, deployShips[i].y, 'ufo_hit');
                            h.width = 20;
                            h.height = 20;
                            h.x += Math.round((aiAttacks[j].x - deployShips[i].x) / 2) - 5;
                            h.y -= 5;
                            hits.push(h);
                            var dd = deployShips[i].deploy * (weps[deployShips[i].station] + 1);
                            if (dd > aiAttacks[j].attack) {
                                deployShips[i].deploy -= aiAttacks[j].attack;
                                aiAttacks[j].kill();
                                aiAttacks.splice(j, 1);
                                continue;
                            }
                            if (dd < aiAttacks[j].attack) {
                                aiAttacks[j].attack -= dd;
                                deployShips[i].kill();
                                deployShips.splice(i, 1);
                                continue;
                            }
                            if (dd == aiAttacks[j].attack) {
                                deployShips[i].kill();
                                deployShips.splice(i, 1);
                                aiAttacks[j].kill();
                                aiAttacks.splice(j, 1);
                                continue;
                            }
                        }
                    }
                }
            }
        }

        // Hits
        var i = hits.length;
        while (i--) {
            hits[i].alpha -= .05;
            if (hits[i].alpha <= .1) {
                hits[i].kill();
                hits.splice(i, 1);
            }
        }

        // Text Updates
        t_earth.text = earth.toString();
        this.centerText(t_earth, centerX);
        t_mothership.text = mothership.toString();
        this.centerText(t_mothership, centerX);
        for (var i = 0; i < 5; i++) {
            t_stations[i].text = stations[i].toString();
            this.centerText(t_stations[i], t_xCenters[i]);
            t_ufos[i].text = ufos[i].toString();
            this.centerText(t_ufos[i], t_xCenters[i]);
        }

    },


    // RENDER
    ///////////////////////////////////////////////////////////////////////////
    render: function() {
        // Line Handling
        //this.game.debug.geom(line, '#ffffff');

        // Debug Text
        if (debugging) {
            this.game.debug.inputInfo(32, 32);
            t_debug.text = f.toString();
            t_debug.text += "\nMAB: " + aiPlans.mass_attack_building.toString();
            t_debug.text += "\nMAIE: " + aiPlans.mass_attack_in_effect.toString();
            t_debug.text += "\nMA UFO: " + aiPlans.mass_attack_ufo.toString();
            t_debug.text += "\nEnemy Spawn Rate: " + enemySpawnRate.toString();
        }
    },


    // GAME METHODS
    ///////////////////////////////////////////////////////////////////////////
    getSpawn: function(c) {
        return Math.round(spawnRate + (tec * tecBonus) + (spawnBonus * c));
    },

    getEnemySpawn: function(c) {
        return Math.round(enemySpawnRate + spawnBonus * c);
    },

    clickEarth: function() {
        this.resetSelection();
        selection = this.add.sprite(0, 650, 'earth_select');
        this.earthMenu();
    },

    clickStation: function(e) {
        this.resetSelection();
        selection = this.add.sprite(e.x - 4, e.y - 4, 'station_select');
        this.stationMenu(e);
    },

    resetSelection: function() {
        if (selection != null) {
            selection.kill();
            selection = null;
        }
    },

    resetMenu: function() {
        if (menu != null) {
            menu.kill();
            menu = null;
        }
        for (var i = 0; i < menuButtons.length; i++) {
            menuButtons[i].kill();
        }
        menuButtons = [];
        for (var i = 0; i < menuText.length; i++) {
            menuText[i].parent.remove(menuText[i]);
        }
        menuText = [];
    },

    earthMenu: function() {
        this.resetMenu();
        menu = this.add.sprite(0, 800, 'earth_menu');
        if (def < maxUpgrade) {
            var def_cost = this.getDefCost();
            var def_color = '#888888';
            if (earth > def_cost) {
                def_color = '#ffffff';
                var bd = this.add.button(14, 813, 'alpha', this.defUp, this);
                bd.width = 192;
                bd.height = 124;
                bd.input.useHandCursor = true;
                menuButtons.push(bd);
            }
            var td = this.add.text(40, 890, 'COST: ' + def_cost.toString(), { font: '20px ' + t_font, fill: def_color });
            menuText.push(td);
        } else {
            var td = this.add.text(40, 890, 'MAXED!', { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(td);
        }
        if (tec < maxUpgrade) {
            var tec_cost = this.getTecCost();
            var tec_color = '#888888';
            if (earth > tec_cost) {
                tec_color = '#ffffff';
                var bt = this.add.button(224, 813, 'alpha', this.tecUp, this);
                bt.width = 192;
                bt.height = 124;
                bt.input.useHandCursor = true;
                menuButtons.push(bt);
            }
            var tt = this.add.text(245, 890, 'COST: ' + tec_cost.toString(), { font: '20px ' + t_font, fill: tec_color });
            menuText.push(tt);
        } else {
            var tt = this.add.text(245, 890, 'MAXED!', { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(tt);
        }
        var bs = this.add.button(430, 813, 'alpha', this.supplyMenu, this);
        bs.width = 192;
        bs.height = 124;
        bs.input.useHandCursor = true;
        menuButtons.push(bs);
    },

    supplyMenu: function() {
        this.resetMenu();
        menu = this.add.sprite(0, 800, 'supply_menu');
        for (var i = 0; i < 5; i++) {
            var b = this.add.button(t_xCenters[i] - 41, 813, 'alpha', this.supplyPercentageMenu, this);
            b.width = 82;
            b.height = 82;
            b.input.useHandCursor = true;
            b.station = i;
            menuButtons.push(b);
        }
    },

    supplyPercentageMenu: function(e) {
        this.resetMenu();
        // Check for current supply orders
        var supplied = false;
        var supplied_idx = 0;
        var supplied_remaining = 0;
        for (var j = 0; j < supplyOrders.length; j++) {
            if (supplyOrders[j].station == e.station) {
                supplied = true;
                supplied_idx = j;
                supplied_remaining = supplyOrders[j].supply;
                break;
            }
        }
        if (supplied) {
            menu = this.add.sprite(0, 800, 'cancel_menu');
            menu.station = e.station;
            menu.name = 'supply_percentage_menu';
            var tso = this.add.text(40, 870, 'SUPPLY ORDER REMAINING: ' + supplied_remaining.toString(), { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(tso);
            var bc = this.add.button(430, 813, 'alpha', function() {
                supplyOrders.splice(supplied_idx, 1);
                this.resetMenu();
                this.earthMenu();
            }, this);
            bc.width = 192;
            bc.height = 124;
            menuButtons.push(bc);
        } else {
            menu = this.add.sprite(0, 800, 'percentage_menu');
            menu.station = e.station;
            menu.name = 'supply_percentage_menu';
            for (var i = 0; i < 5; i++) {
                if (supplied[0]) {
                    var b = this.add.button(t_xCenters[i] - 51, 822, 'alpha', this.setSupplyOrder, this);
                    b.width = 92;
                    b.height = 92;
                    b.input.useHandCursor = true;
                    b.station = e.station;
                    b.percentage = percentages[i];
                    menuButtons.push(b);
                } else {
                    var b = this.add.button(t_xCenters[i] - 51, 822, 'alpha', this.setSupplyOrder, this);
                    b.width = 92;
                    b.height = 92;
                    b.input.useHandCursor = true;
                    b.station = e.station;
                    b.percentage = percentages[i];
                    menuButtons.push(b);
                }
            }
        }
    },

    stationMenu: function(e) {
        this.resetMenu();
        menu = this.add.sprite(0, 800, 'station_menu');
        menu.station = e.station;

        if (spds[e.station] < maxUpgrade) {
            var spd_cost = this.getSpdCost(e.station);
            var spd_color = '#888888';
            if (stations[e.station] > spd_cost) {
                spd_color = '#ffffff';
                var bs = this.add.button(14, 813, 'alpha', this.spdUp, this);
                bs.width = 192;
                bs.height = 124;
                bs.station = e.station;
                bs.input.useHandCursor = true;
                menuButtons.push(bs);
            }
            var ts = this.add.text(40, 890, 'COST: ' + spd_cost.toString(), { font: '20px ' + t_font, fill: spd_color });
            menuText.push(ts);
        } else {
            var ts = this.add.text(40, 890, 'MAXED!', { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(ts);
        }
        if (weps[e.station] < maxUpgrade) {
            var wep_cost = this.getWepCost(e.station);
            var wep_color = '#888888';
            if (stations[e.station] > wep_cost) {
                wep_color = '#ffffff';
                var bw = this.add.button(224, 813, 'alpha', this.wepUp, this);
                bw.width = 192;
                bw.height = 124;
                bw.station = e.station;
                bw.input.useHandCursor = true;
                menuButtons.push(bw);
            }
            var tw = this.add.text(245, 890, 'COST: ' + wep_cost.toString(), { font: '20px ' + t_font, fill: wep_color });
            menuText.push(tw);
        } else {
            var tw = this.add.text(245, 890, 'MAXED!', { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(tw);
        }
        var bd = this.add.button(430, 813, 'alpha', this.deployMenu, this);
        bd.width = 192;
        bd.height = 124;
        bd.station = e.station;
        bd.input.useHandCursor = true;
        menuButtons.push(bd);
    },

    deployMenu: function(e) {
        this.resetMenu();
        // Check for current deploy orders
        var deployed = false;
        var deployed_idx = 0;
        var deployed_remaining = 0;
        for (var j = 0; j < deployOrders.length; j++) {
            if (deployOrders[j].station == e.station) {
                deployed = true;
                deployed_idx = j;
                deployed_remaining = deployOrders[j].deploy;
                break;
            }
        }
        if (deployed) {
            menu = this.add.sprite(0, 800, 'cancel_menu');
            menu.station = e.station;
            menu.name = 'deploy_menu';
            var tdo = this.add.text(40, 870, 'DEPLOY ORDER REMAINING: ' + deployed_remaining.toString(), { font: '20px ' + t_font, fill: '#ffff00' });
            menuText.push(tdo);
            var bc = this.add.button(430, 813, 'alpha', function() {
                deployOrders.splice(deployed_idx, 1);
                this.resetMenu();
                this.stationMenu({station: e.station});
            }, this);
            bc.width = 192;
            bc.height = 124;
            menuButtons.push(bc);
        } else {
            menu = this.add.sprite(0, 800, 'percentage_menu');
            menu.station = e.station;
            menu.name = 'deploy_menu';
            for (var i = 0; i < 5; i++) {
                var b = this.add.button(t_xCenters[i] - 51, 822, 'alpha', this.setDeployOrder, this);
                b.width = 92;
                b.height = 92;
                b.input.useHandCursor = true;
                b.station = e.station;
                b.percentage = percentages[i];
                menuButtons.push(b);
            }
        }
    },

    setSupplyOrder: function(e) {
        // Supply orders handled in UPDATE
        var supply = Math.round(earth * (e.percentage / 100));
        // Build supply order...
        var so = {
            station: e.station,
            supply: supply
        };
        supplyOrders.push(so);
        this.resetMenu();
        this.earthMenu();
    },

    sendSupply: function(supply, station) {
        var ss = this.add.sprite(0, 0, 'blue_ship');
        var y;
        switch (station) {
            case 0:
                y = 740;
                break;
            case 1:
                y = 676;
                break;
            case 2:
                y = 653;
                break;
            case 3:
                y = 676;
                break;
            case 4:
                y = 740;
                break;
        }
        ss.x = t_xCenters[station] - 35 + this.randomInt(0, 70);
        ss.y = y;
        ss.supply = supply;
        ss.station = station;
        supplyShips.push(ss);
    },

    setDeployOrder: function(e) {
        // Deploy orders handled in UPDATE
        var deploy = Math.round(stations[e.station] * (e.percentage / 100));
        // Target (ufo or mothership)
        var target = 'ufo';
        if (ufos[e.station] < 0) {
            target = 'mothership';
        }
        // Build deploy order...
        var depo = {
            station: e.station,
            deploy: deploy,
            target: target
        };
        deployOrders.push(depo);
        this.resetMenu();
        this.stationMenu(e);
    },

    sendDeployment: function(deploy, station, target) {
        var ds = this.add.sprite(0, 0, 'blue_ship');
        ds.x = t_xCenters[station] - 20 + this.randomInt(0, 40);
        ds.y = t_yValsStations[station] - 38;
        ds.deploy = deploy;
        ds.station = station;
        ds.target = target;
        deployShips.push(ds);
    },

    getDefCost: function() {
        return defCost[def];
    },

    getTecCost: function() {
        return tecCost[tec];
    },

    getSpdCost: function(i) {
        return spdCost[spds[i]];
    },

    getWepCost: function(i) {
        return wepCost[weps[i]];
    },

    defUp: function() {
        if (earth > this.getDefCost()) {
            earth -= this.getDefCost();
            def += 1;
            defIcon.loadTexture('def' + def.toString());
            this.resetMenu();
            this.earthMenu();
        }
    },

    tecUp: function() {
        if (earth > this.getTecCost()) {
            earth -= this.getTecCost();
            tec += 1;
            tecIcon.loadTexture('tec' + tec.toString());
            this.resetMenu();
            this.earthMenu();
        }
    },

    spdUp: function(e) {
        if (stations[e.station] > this.getSpdCost(e.station)) {
            stations[e.station] -= this.getSpdCost(e.station);
            spds[e.station] += 1;
            spdIcons[e.station].loadTexture('spd' + spds[e.station].toString());
            this.resetMenu();
            this.stationMenu({station: e.station});
        }
    },

    wepUp: function(e) {
        if (stations[e.station] > this.getWepCost(e.station)) {
            stations[e.station] -= this.getWepCost(e.station);
            weps[e.station] += 1;
            wepIcons[e.station].loadTexture('wep' + weps[e.station].toString());
            this.resetMenu();
            this.stationMenu({station: e.station});
        }
    },

    getActiveUfos: function() {
        var a = 0;
        for (var i = 0; i < 5; i++) {
            if (ufos[i] >= 0) {
                a += 1;
            }
        }
        return a;
    },


    // AI FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////

    // AI Tick
    ai: function() {

        var attack_from = [];

        // UFO management
        var avgUfo = 0;
        for (var i = 0; i < 5; i++) {
            avgUfo += ufos[i];
        }
        avgUfo /= 5;
        for (var i = 0; i < 5; i++) {
            // Dead?
            if (ufos[i] < 0) {
                this.aiSendSupply(i);
                if (debugging) {
                    console.log("Sending dead supply to " + i.toString());
                }
                continue;
            }
            // Needy?
            if (ufos[i] / avgUfo < .5) {
                if (!aiPlans.mass_attack_building) {
                    if (debugging) {
                        console.log("Sending needy supply to " + i.toString());
                    }
                    this.aiSendSupply(i);
                }
            }
            // Ready to rock?
            if (ufos[i] / avgUfo > 1.5) {
                if (i != aiPlans.mass_attack_ufo) {
                    this.aiSendAttack(i);
                    if (debugging) {
                        console.log("Sending rock start attack from " + i.toString());
                    }
                    attack_from.push(i);
                }
            }
        }

        // Random attack
        var raf = aiPlans.random_attack_freq;
        if (enemySpawnRate == aiPlans.limit_break_spawn) {
            raf = aiPlans.limit_break_random_attack_freq;
        }
        if (this.randomInt(1, 100) <= raf) {
            // Send random attack
            var attack_to = this.randomInt(0, 4);
            var ok_to_attack = true;
            for (var i = 0; i < attack_from.length; i++) {
                if (attack_to == attack_from[i]) {
                    ok_to_attack = false;
                }
            }
            if ((aiPlans.mass_attack_building || aiPlans.mass_attack_in_effect) && attack_to == aiPlans.mass_attack_ufo) {
                ok_to_attack = false;
            }
            if (ok_to_attack) {
                this.aiSendAttack(attack_to);
                if (debugging) {
                    console.log("Sending random attack from " + attack_to);
                }
            }
        }

        // Mass attack
        if (aiPlans.mass_attack) {
            if (!aiPlans.mass_attack_building) {
                if (this.randomInt(1, aiPlans.mass_attack_freq_of) <= aiPlans.mass_attack_freq) {
                    aiPlans.mass_attack_building = true;
                    aiPlans.mass_attack_build_frame_start = f;
                    // Select appropriate mass attack UFO
                    aiPlans.mass_attack_ufo = 0;
                    for (var i = 1; i < 5; i++) {
                        if (ufos[i] > ufos[aiPlans.mass_attack_ufo]) {
                            aiPlans.mass_attack_ufo = i;
                        }
                    }
                }
            } else {
                if (aiPlans.mass_attack_in_effect) {
                    if (ufos[aiPlans.mass_attack_ufo] > shipsPerTick) {
                        this.aiSendAttack(aiPlans.mass_attack_ufo);
                        if (debugging) {
                            console.log("Sending mass attack from " + aiPlans.mass_attack_ufo.toString());
                        }
                    } else {
                        aiPlans.mass_attack_in_effect = false;
                        aiPlans.mass_attack_building = false;
                    }
                } else {
                    if (f - aiPlans.mass_attack_build_frame_start >= aiPlans.mass_attack_build_frames) {
                        aiPlans.mass_attack_in_effect = true;
                    } else {
                        this.aiSendSupply(aiPlans.mass_attack_ufo);
                        if (debugging) {
                            console.log("Sending mass attack supply to " + aiPlans.mass_attack_ufo.toString());
                        }
                    }
                }
            }
        }

        // Limit Break
        if (aiPlans.limit_break) {
            if (this.randomInt(1, aiPlans.limit_break_freq_of) <= aiPlans.limit_break_freq) {
                if (debugging) {
                    console.log("*** LIMIT BREAK! ***");
                }
                enemySpeed = aiPlans.limit_break_spd;
                enemySpawnRate = aiPlans.limit_break_spawn;
            }
        }

        // Aggressive
        for (var i = 0; i < 5; i++) {
            if (stations[i] < 0) {
                ok_to_attack = true;
                for (var j = 0; j < attack_from.length; j++) {
                    if (attack_from[j] == i) {
                        ok_to_attack = false;
                    }
                }
                if (ok_to_attack) {
                    this.aiSendAttack(i);
                    if (debugging) {
                        console.log("Sending aggressive attack to " + i.toString());
                    }
                }
            }
        }

    },

    // AI Supply
    // (handled in UPDATE)
    aiSendSupply: function(i) {
        if (mothership < shipsPerTick) {
            return;
        }
        var s = this.add.sprite(t_xCenters[i] - 7, t_yValsMothership[i] - 10, 'red_ship');
        s.supply = shipsPerTick;
        s.station = i;
        mothership -= s.supply;
        aiSupply.push(s);
    },

    // AI Attack
    // (handled in UPDATE)
    aiSendAttack: function(i) {
        if (ufos[i] < shipsPerTick) {
            return;
        }
        var a = this.add.sprite(t_xCenters[i] - 7, t_yValsUfos[i] + 30, 'red_ship');
        a.attack = shipsPerTick;
        a.station = i;
        ufos[i] -= a.attack;
        aiAttacks.push(a);
    },


    // HELPER FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////

    // Hide object (sprite or line)
    hide: function(o) {
        var locX = -Math.abs(Math.round(Math.random() * 999999999) + 9999);
        var locY = -Math.abs(Math.round(Math.random() * 999999999) + 9999);
        o.x = locX;
        o.y = locY;
        if (o.body != null) {
            o.body.x = locX;
            o.body.y = locY;
        }
        // Line?
        if (typeof o.end == 'object' && typeof o.start == 'object') {
            o.setTo(locX, locY, locX, locY);
        }
    },

    // Set sprite position
    setPos: function(o, x, y) {
        o.x = x;
        o.y = y;
        if (o.body != null) {
            o.body.x = x;
            o.body.y = y;
        }
    },

    // Center rendered text
    centerText: function(t, x) {
        t.x = x - t.width / 2;
    },

    // Simple Hit Test (AABB)
    hitTest: function(a, b) {
        return !(((a.x + a.width - 1) < b.x) ||
                 ((b.x + b.width - 1) < a.x) ||
                 ((a.y + a.height - 1) < b.y) ||
                 ((b.y + b.height - 1) < a.y));
    },

    // Random Integer Helper
    randomInt: function(min, max) {
        var r = Math.random();
        var ri = Math.floor(r * (max - min + 1) + min);
        return ri;
    },

    // Get Unique Array Helper
    arrayUnique: function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    }
};