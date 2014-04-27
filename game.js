/*jslint node: true */
'use strict';

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

//setup the input
var upKey;
var downKey;
var leftKey;
var rightKey;
var confirmKey;
var global = {};

game.cutscene = null;
global.trigger = null;
game.showDebugging = false;

/*TEST STATE Outside*/
var launchpadLanding = function(){};

launchpadLanding.prototype.preload = function()
{
	game.load.tilemap('launchpadLandingLevel', 'assets/tilemaps/launchpad-landing.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('launchpadLandingTiles', 'assets/tilesets/outline-tiles.png');
	game.load.image('player', 'assets/graphics/test-player.png');
	game.load.image('enemy1', 'assets/graphics/enemy1.png');
	game.load.image('enemy2', 'assets/graphics/enemy2.png');
	game.load.image('trigger', 'assets/graphics/trigger.png');
	game.load.image('medpack', 'assets/graphics/medpack.png');
	game.load.spritesheet('swing-attack', 'assets/graphics/swing-attack.png',48,48);
};

launchpadLanding.prototype.create = function()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Setup Level
	this.map = game.add.tilemap('launchpadLandingLevel');
	this.map.addTilesetImage('outline-tiles', 'launchpadLandingTiles', 32, 32);
	this.map.setCollision([1,2,3,5,6,7,8,9,10,11]);

	this.layer = this.map.createLayer(0);
	this.layer.resizeWorld();

	standardCreate(this);
};

launchpadLanding.prototype.update = function()
{
	standardUpdate(this);
};

/*TEST STATE Outside*/
var testState = function(){};

testState.prototype.preload = function()
{
	game.load.tilemap('testStateLevel', 'assets/tilemaps/test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testStateTiles', 'assets/tilesets/test-tiles.png');
	game.load.image('player', 'assets/graphics/test-player.png');
	game.load.image('enemy1', 'assets/graphics/enemy1.png');
	game.load.image('enemy2', 'assets/graphics/enemy2.png');
	game.load.image('trigger', 'assets/graphics/trigger.png');
	game.load.image('medpack', 'assets/graphics/medpack.png');
	game.load.spritesheet('swing-attack', 'assets/graphics/swing-attack.png',48,48);
};

testState.prototype.create = function()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Setup Level
	this.map = game.add.tilemap('testStateLevel');
	this.map.addTilesetImage('test-tiles', 'testStateTiles', 32, 32);
	this.map.setCollision([1,2,3,5]);

	this.layer = this.map.createLayer(0);
	this.layer.resizeWorld();

	standardCreate(this);
};

testState.prototype.update = function()
{
	standardUpdate(this);
};


/*TEST STATE Outside*/
var testStateOutside = function(){};

testStateOutside.prototype.preload = function()
{
	game.load.tilemap('testStateOutsideLevel', 'assets/tilemaps/testoutside.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testStateOutsideTiles', 'assets/tilesets/test-tiles-outside.png');
	game.load.image('player', 'assets/graphics/test-player.png');
	game.load.image('enemy1', 'assets/graphics/enemy1.png');
	game.load.image('enemy2', 'assets/graphics/enemy2.png');
	game.load.image('trigger', 'assets/graphics/trigger.png');
	game.load.image('medpack', 'assets/graphics/medpack.png');
	game.load.spritesheet('swing-attack', 'assets/graphics/swing-attack.png',48,48);
};

testStateOutside.prototype.create = function()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Setup Level
	this.map = game.add.tilemap('testStateOutsideLevel');
	this.map.addTilesetImage('test-tiles-outside', 'testStateOutsideTiles', 32, 32);
	this.map.setCollision([1,2,3,5]);

	this.layer = this.map.createLayer(0);
	this.layer.resizeWorld();

	standardCreate(this);
};

testStateOutside.prototype.update = function()
{
	standardUpdate(this);
};


testStateOutside.prototype.render = function()
{
	if (game.showDebugging)
	{
		for (var i = 0; i < this.mapEntities.children.length; i++)
		{
			game.debug.body(this.mapEntities.getAt(i));

			//if (this.mapEntities.getAt(i).key == 'enemy2')
			//{
			//	game.debug.text(this.mapEntities.getAt(i).state, 100, 380 );
			//}
		}
	}
	/**/
	//game.debug.cameraInfo(game.camera, 32, 32);
	
	//game.debug.text('Arrows to move,\'Z\' to attack', 30, 30 );
	//game.debug.text('Health: '+this.player.health, 30, 50 );
};

/****************************

END GAME STATES

*****************************/

function standardCreate(that)
{	
	//setup the input
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	confirmKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

	//setup map entities
	that.mapEntities = game.add.group();
	that.mapEntities.sort();
	
	that.map.createFromObjects('Object Layer 1', 11, 'trigger', '', true, false, that.mapEntities);
	that.map.createFromObjects('Object Layer 1', 12, 'medpack', '', true, false, that.mapEntities);
	that.map.createFromObjects('Object Layer 1', 13, 'player', '', true, false, that.mapEntities);
	that.map.createFromObjects('Object Layer 1', 14, 'enemy1', '', true, false, that.mapEntities);
	that.map.createFromObjects('Object Layer 1', 15, 'enemy2', '', true, false, that.mapEntities);

	for (var i = 0; i < that.mapEntities.children.length; i++)
	{
		game.physics.enable(that.mapEntities.getAt(i),Phaser.Physics.ARCADE);

		if (that.mapEntities.getAt(i).key == 'trigger')
		{
			that.mapEntities.getAt(i).body.setSize(that.mapEntities.getAt(i).triggerWidth, that.mapEntities.getAt(i).triggerHeight, 0, 0);
			that.mapEntities.getAt(i).body.immovable = true;
			//that.mapEntities.getAt(i).callTrigger = callTrigger;
		}
		if (that.mapEntities.getAt(i).key == 'player')
		{
			that.mapEntities.getAt(i).attackCountdown = 0;
			that.mapEntities.getAt(i).stepInsideEntity = playerStep;
			that.mapEntities.getAt(i).health = 400;
			that.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
			that.player = that.mapEntities.getAt(i);
			that.mapEntities.player = that.player;
		}
		if (that.mapEntities.getAt(i).key == 'medpack')
		{
			that.mapEntities.getAt(i).stepInsideEntity = medpackStep;
			that.mapEntities.getAt(i).body.setSize(32, 32, 0, 0);
			that.mapEntities.getAt(i).health = 10;
		}
		if (that.mapEntities.getAt(i).key == 'enemy1')
		{
			that.mapEntities.getAt(i).state = 'waiting';
			that.mapEntities.getAt(i).searchX = that.mapEntities.getAt(i).x;
			that.mapEntities.getAt(i).searchY = that.mapEntities.getAt(i).y;
			that.mapEntities.getAt(i).stepInsideEntity = enemy1Step;
			that.mapEntities.getAt(i).health = 20;
			that.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
		}

		if (that.mapEntities.getAt(i).key == 'enemy2')
		{
			that.mapEntities.getAt(i).state = 'waiting';
			that.mapEntities.getAt(i).searchX = that.mapEntities.getAt(i).x;
			that.mapEntities.getAt(i).searchY = that.mapEntities.getAt(i).y;
			that.mapEntities.getAt(i).jumpCountdown = 0;
			that.mapEntities.getAt(i).jumpAngle = 0;
			that.mapEntities.getAt(i).jumpX = 0;
			that.mapEntities.getAt(i).jumpY = 0;
			that.mapEntities.getAt(i).stepInsideEntity = enemy2Step;
			that.mapEntities.getAt(i).health = 60;
			that.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
		}

	}

	game.camera.follow(that.player);

	//setup hud
	that.displayText = game.add.text(20, 20, 'Health:\nArrows to move, \'Z\' to attack',{ font: '16px Courier', fill: '#FFFFFF', align: 'left' });
	that.displayText.fixedToCamera = true;
	that.displayText.cameraOffset.x = 20;
	that.displayText.cameraOffset.y = 20;

	that.graphicsObject = game.add.graphics(0,0);
	that.graphicsObject.fixedToCamera = true;
	that.graphicsObject.cameraOffset.x = 0;
	that.graphicsObject.cameraOffset.y = 0;
}

function standardUpdate(that)
{
	//Check all Collisions
	game.physics.arcade.collide(that.mapEntities, that.mapEntities,function(left,right)
	{
		//player and enemy attacks
		if((left.key === 'enemy1' || left.key === 'enemy2' || left.key === 'enemy3') && right.key === 'player')
		{
			right.health--;
		}

		if(left.key === 'player' && (right.key === 'enemy1' || right.key === 'enemy2' || right.key === 'enemy3'))
		{
			left.health--;
		}

		//player and trigger
		if(left.key === 'trigger' && right.key === 'player')
		{
			global.trigger = left;
		}
		if(left.key === 'player' && right.key === 'trigger')
		{
			global.trigger = right;
		}

		//player and health
		if(left.key === 'medpack' && right.key === 'player')
		{
			right.health+= 100;
			if (right.health > 400)
			{
				right.health = 400;
			}
			left.health = 0;
		}
		if(left.key === 'player' && right.key === 'medpack')
		{
			left.health+= 100;
			if (left.health > 400)
			{
				left.health = 400;
			}
			right.health = 0;
		}
	});
	game.physics.arcade.overlap(that.mapEntities, that.mapEntities,function(left,right)
	{
		//enemy and player attacks
		if((left.key === 'enemy1' || left.key === 'enemy2' || left.key === 'enemy3') && right.key === 'swing-attack')
		{
			left.health--;
		}

		if(left.key === 'swing-attack' && (right.key === 'enemy1' || right.key === 'enemy2' || right.key === 'enemy3'))
		{
			right.health--;
		}

		//player and enemy attacks
		if((left.key === 'enemy1' || left.key === 'enemy2' || left.key === 'enemy3') && right.key === 'player')
		{
			right.health--;
		}

		if(left.key === 'player' && (right.key === 'enemy1' || right.key === 'enemy2' || right.key === 'enemy3'))
		{
			left.health--;
		}

	});
	game.physics.arcade.collide(that.mapEntities, that.layer);

	//reset all movement
	that.mapEntities.setAll('body.velocity.x',0);
	that.mapEntities.setAll('body.velocity.y',0);

	//Update all Entities
	that.mapEntities.callAll('stepInsideEntity');

	//Do the depth sort
	that.mapEntities.sort('y', Phaser.Group.SORT_ASCENDING);

	//update hud
	that.graphicsObject.clear();
	if (game.cutscene === null)
	{
		that.displayText.setText('Health:\nArrows to move, \'Z\' to attack');
		that.displayText.cameraOffset.x = 20;
		that.displayText.cameraOffset.y = 20;
		that.graphicsObject.beginFill(rgbArrayToHex(hslToRgb(that.player.health/1200,0.45,0.65)));
		that.graphicsObject.drawRect(100, 18, 400, 18);
		that.graphicsObject.beginFill(rgbArrayToHex(hslToRgb(that.player.health/1200,0.85,0.65)));
		//that.graphicsObject.beginFill('');
		that.graphicsObject.drawRect(100, 18, that.player.health, 18);		
	}

	//Do cutscene stuff if there is a cutscene
	if(global.trigger !== null)
	{
		if (global.trigger.todo === undefined)
		{
			global.trigger.todo = eval(global.trigger.actions);
			game.cutscene = true;
			global.trigger.waiting = false;
		}

		if (global.trigger.todo !== undefined)
		{
			if (global.trigger.todo.length > 0)
			{
				//if the next action is a message
				if (global.trigger.todo.length !== 0 && global.trigger.todo[0].message)
				{
					if(global.trigger.waiting === false)
					{
						global.trigger.waiting = true;
					}
					if(global.trigger.waiting === true)
					{
						//that.graphicsObject.beginFill(0x000000);
						//that.graphicsObject.drawRect(0, 410, 630, 100);
						that.displayText.setText(global.trigger.todo[0].message);
						that.displayText.cameraOffset.x = 20;
						that.displayText.cameraOffset.y = 420;

						if (confirmKey.isDown && confirmKey.repeats === 0)
						{
							global.trigger.todo.shift();
							global.trigger.waiting = false;
						}	
					}
				}

				//if the next action is change level
				if (global.trigger.todo.length !== 0 && global.trigger.todo[0].switchLevel)
				{
					var temp = global.trigger.todo[0].switchLevel;
					global.trigger.todo.shift();
					game.state.add('game', eval(temp), true);
				}
			}
			
			if (global.trigger.todo.length === 0)
			{
				//game.cutscene.destroy();
				game.cutscene = null;
				global.trigger.destroy();
				global.trigger = null;
			}
		}
	}
}

function playerStep()
{
	if(game.cutscene === null)
	{
		if (this.attackCountdown > 0)
		{
			this.attackCountdown--;
		}

		//player movement and input
		//this.player.body.velocity.x = 0;
		//this.player.body.velocity.y = 0;
		if(upKey.isDown)
		{
			this.body.velocity.y = -120;
		}
		else if (downKey.isDown)
		{
			this.body.velocity.y = 120;
		}
		if(leftKey.isDown)
		{
			this.body.velocity.x = -120;
		}
		else if (rightKey.isDown)
		{
			this.body.velocity.x = 120;
		}

		if (confirmKey.isDown && this.attackCountdown === 0)
		{
			//up
			if(upKey.isDown && !leftKey.isDown && !rightKey.isDown && !downKey.isDown)
			{
				var attack = game.add.sprite(this.x-8, this.y-24, 'swing-attack',0);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//up-right
			if(upKey.isDown && !leftKey.isDown && rightKey.isDown && !downKey.isDown)
			{
				var attack = game.add.sprite(this.x+16, this.y-12, 'swing-attack',1);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//right
			if(!upKey.isDown && !leftKey.isDown && rightKey.isDown && !downKey.isDown)
			{
				var attack = game.add.sprite(this.x+24, this.y+16, 'swing-attack',2);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//down-right
			if(!upKey.isDown && !leftKey.isDown && rightKey.isDown && downKey.isDown)
			{
				var attack = game.add.sprite(this.x+16, this.y+36, 'swing-attack',3);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//down
			if(!upKey.isDown && !leftKey.isDown && !rightKey.isDown && downKey.isDown)
			{
				var attack = game.add.sprite(this.x-8, this.y+48, 'swing-attack',4);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//down-left
			if(!upKey.isDown && leftKey.isDown && !rightKey.isDown && downKey.isDown)
			{
				var attack = game.add.sprite(this.x-28, this.y+36, 'swing-attack',5);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//left
			if(!upKey.isDown && leftKey.isDown && !rightKey.isDown && !downKey.isDown)
			{
				var attack = game.add.sprite(this.x-40, this.y+16, 'swing-attack',6);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}
			
			//up-left
			if(upKey.isDown && leftKey.isDown && !rightKey.isDown && !downKey.isDown)
			{
				var attack = game.add.sprite(this.x-32, this.y-12, 'swing-attack',7);
				attack.healthValue = 10;
				game.physics.enable(attack,Phaser.Physics.ARCADE);
				attack.body.immovable = true;
				attack.stepInsideEntity = swingAttack;
				this.parent.add(attack);

				this.attackCountdown = 30;
			}		
		}

		//so you don't run through enemies and spam attack
		if (this.attackCountdown > 20)
		{
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
		}

	}

	/*Keep the position as intergers to make the rendering not blur out*/
	this.body.x = Math.round(this.body.x);
	this.body.y = Math.round(this.body.y);

	if (this.health < 1)
	{
		this.destroy();
	}
}

function swingAttack()
{
	if(game.cutscene === null)
	{
		if (this.healthValue === 0)
		{
			this.destroy();
		}

		this.healthValue--;
	}
}

function medpackStep()
{
	if(game.cutscene === null)
	{
		if (this.health === 0)
		{
			this.destroy();
		}
	}
}

function enemy1Step()
{
	if(game.cutscene === null)
	{
		if (this.state == 'waiting')
		{
			//if target found
			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) < 300)
			{
				this.state = 'hunting';
			}
		}

		if (this.state == 'searching')
		{
			//if target lost, search last known location
			this.body.velocity.x = Math.sin(game.math.angleBetween(this.x, this.y,this.searchX, this.searchY)) * 30;
			this.body.velocity.y = Math.cos(game.math.angleBetween(this.x, this.y,this.searchX, this.searchY)) * 30;

			//if done searching
			if (Phaser.Math.distance(this.x,this.y,this.searchX,this.searchY) < 10)
			{
				this.state = 'waiting';
			}

			//if target found
			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) < 300)
			{
				this.state = 'hunting';
			}
		}

		if (this.state == 'hunting')
		{
			this.body.velocity.x = Math.sin(game.math.angleBetween(this.x, this.y,this.parent.player.x, this.parent.player.y)) * 30;
			this.body.velocity.y = Math.cos(game.math.angleBetween(this.x, this.y,this.parent.player.x, this.parent.player.y)) * 30;

			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) > 350)
			{
				this.state = 'searching';
				this.searchX = this.parent.player.x;
				this.searchY = this.parent.player.y;
			}
		}

		if (this.health < 1)
		{
			this.destroy();
		}
	}
}

function enemy2Step()
{
	if(game.cutscene === null)
	{
		if (this.state == 'waiting')
		{
			//if target found
			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) < 300)
			{
				this.state = 'hunting';
			}
		}

		if (this.state == 'searching')
		{
			//if target lost, search last known location
			if (this.jumpCountdown === 0)
			{
				this.jumpAngle = game.math.angleBetween(this.x, this.y,this.searchX, this.searchY);
				this.jumpCountdown = 50;

				this.jumpX = Math.sin(this.jumpAngle) * 400;
				this.jumpY = Math.cos(this.jumpAngle) * 400;
			}

			//if done searching
			if (Phaser.Math.distance(this.x,this.y,this.searchX,this.searchY) < 10)
			{
				this.state = 'waiting';
			}

			//if target found
			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) < 300)
			{
				this.state = 'hunting';
			}
		}

		if (this.state == 'hunting')
		{
			if (this.jumpCountdown < 1)
			{
				this.jumpAngle = game.math.angleBetween(this.x, this.y,this.parent.player.x, this.parent.player.y);
				this.jumpCountdown = 50;

				this.jumpX = Math.sin(this.jumpAngle) * 400;
				this.jumpY = Math.cos(this.jumpAngle) * 400;
			}

			if (Phaser.Math.distance(this.parent.player.x,this.parent.player.y,this.x,this.y) > 350)
			{
				this.state = 'searching';
				this.searchX = this.parent.player.x;
				this.searchY = this.parent.player.y;
			}
		}

		this.jumpX *= 0.9;
		this.jumpY *= 0.9;

		this.body.velocity.x = this.jumpX;
		this.body.velocity.y = this.jumpY;

		this.jumpCountdown--;

		if (this.health < 1)
		{
			this.destroy();
		}
	}
}

//Colour conversion used for the health bar, WHY IS THIS NOT BUILT INTO PHASER?
function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}
//0.33,0.85,0.65
function hslToRgb(h, s, l)
{
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbArrayToHex(rgbArray) {
    return "0x" + componentToHex(rgbArray[0]) + componentToHex(rgbArray[1]) + componentToHex(rgbArray[2]);
}

//game.state.add('game', testState, true);
//game.state.add('game', testStateOutside, true);
game.state.add('game', launchpadLanding, true);