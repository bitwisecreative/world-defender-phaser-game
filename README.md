
# World Defender

A game I created in Phaser some years ago.

----


![World Defender Phaser Game](https://bitwisecreative.com/site/assets/files/1054/world-defender-html5-game-m.jpg)

----

An HTML5 strategy game geared for quick fun! Destroy the mothership before it destroys Earth!

*Don't forget to read the in-game help!*

 - Configuration options to tweak the game
 - Easy to swap out board graphics
 - Game scales for any screen
 - Works in all HTML5 browsers
 - Built with Phaser
 - Simple click/touch controls
 - 640x960 Native Resolution
 - PSDs Included
 - Full source included

----

### Assets

----------

**Fonts**

The title font used for this game is called "Yukarimobile", and is commercial use friendly:

-   [Yukarimobile](http://www.fontsquirrel.com/fonts/Yukarimobile)

The in-game font for resource counts is defined as: `Consolas, monaco, monospace`
(You can change this if you wish by editing the `t_font` variable in `/js/Game.js`)

----

**Images / Sprites**

Game screen images, UI, buttons, and other misc. images are located in the `/img` folder.

All of the help screens are located in the `/img/help` folder.

The game sprites (ships, selections, hits, and destroyed stations) are located in the `/img/sprites` folder.

The power up icons (def, tec, spd, wep) are located in the `/img/sprites/icons` folder.

Note that buttons are included in the graphics. A transparent PNG is placed and sized for the button sprite in the code.

Also, note that the game board is a single image.

The PSD files for all images are located in the `/img/_PSD` folder

----

### Javascript

This game uses the  [Phaser HTML5 Game Framework](http://phaser.io/). 

All of the Javascript files are located in the `/js` folder.  

**Phaser Framework**  
Both of these files are required for the game to run. They should be left alone.

-   `phaser.min.js`
-   `phaser.map`
    

**Game Files**  

-   `Boot.js`
    -   Sets some display preferences, and gets the preloading text ready.
-   `Preload.js`
    -   Preloads all of the game assets.
-   `MainMenu.js`
    -   The "Main Menu" screen.
-   `Help.js`
    -   The in-game "Help" screens.
-   `Game.js`
    -   The main game.
-   `GameOver.js`
    -   The "Game Over" screen.

----

### Configuration

There are a few configuration variables located at the top of the `Game.js` file.

It looks like this:

```js
///////////////////////////////////////////////////////////////////////
// CONFIGS
tick =  60;  // Frames
shipsPerTick =  20;
shipCombat =  true;
mothershipStart =  300;
ufoStart =  30;
earthStart =  100;
stationStart =  10;
spawnRate =  1;  // Per tick
enemySpawnRate =  3;
spawnBonus =  .005;
speedStart =  .2;  // per frame
enemySpeed =  .6;
maxUpgrade =  3;
defCost =  [20,  40,  80];
tecCost =  [20,  40,  80];
wepCost =  [10,  20,  40];
spdCost =  [10,  20,  40];
tecBonus =  1;  // Added to spawnRate
aiPlans =  {
	random_attack_freq:  25,  // percentage out of 100
	aggressive:  true,
	mass_attack:  true,
	mass_attack_ufo:  -1,
	mass_attack_freq:  1,
	mass_attack_freq_of:  120,
	mass_attack_building:  false,
	mass_attack_in_effect:  false,
	mass_attack_build_frames:  1200,
	mass_attack_build_frame_start:  -1,
	limit_break:  true,
	limit_break_freq:  1,
	limit_break_freq_of:  120,
	limit_break_spd:  1,
	limit_break_spawn:  5,
	limit_break_random_attack_freq:  100
};
///////////////////////////////////////////////////////////////////////
```

**tick**  - Frames per "tick". A tick causes resources to spawn, and supply/deploy orders to be fulfilled.

**shipsPerTick**  - How many resources can fit in a single ship, per tick.

**shipCombat**  - A toggle to enable/disable ship to ship combat.

**mothershipStart**  - Resources the mothership starts with.

**ufoStart**  - Resources the ufos start with.

**earthStart**  - Resources Earth starts with.

**stationStart**  - Resources the stations start with.

**spawnRate**  - Base player spawn rate, per tick.

**enemySpawnRate**  - Base enemy spawn rate, per tick.

**spawnBonus**  - A multiplier for spawn bonus (i.e., the more resources you have, the faster they'll grow).

**speedStart**  - Base player ship speed (per frame)

**enemySpeed**  - Base enemy ship speed (per frame)

**maxUpgrade**  - ! This value is pretty much hard-coded into the game, since there only graphics to accomodate this many levels !

**defCost**  - The costs for def upgrades

**tecCost**  - The costs for tec upgrades

**wepCost**  - The costs for wep upgrades

**spdCost**  - The costs for spd upgrades

**tecBonus**  - The spawn bonus given for tec upgrades (added to spawnRate)

**aiPlans**  - An object containing some enemy AI settings:

 - **random_attack_freq** - Out of 100, whether or not to randomly attack per tick
 - **aggressive** - If true, the mothership will aggressively attack Earth when a station is destroyed
 - **mass_attack** - A toggle for the mass attack plan (mothership will build up a single UFO, and unleash a large attack)
 - **limit_break** - A toggle for the UFO "limit break", which increases its speed and spawn rate (only increases once per game)
