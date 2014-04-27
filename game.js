/*jslint node: true */
'use strict';

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

//setup the input
var upKey;
var downKey;
var leftKey;
var rightKey;
var confirmKey;

/*TEST STATE*//*
var testState = function(){};

testState.prototype.preload = function()
{
	game.load.tilemap('testStateLevel', 'assets/tilemaps/test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testStateTiles', 'assets/tilesets/test-tiles.png');
	game.load.image('player', 'assets/graphics/test-player.png');
};

testState.prototype.create = function()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.map = game.add.tilemap('testStateLevel');
	this.map.addTilesetImage('test-tiles', 'testStateTiles', 32, 32);
	this.map.setCollision([1,2,3]);

	this.layer = this.map.createLayer(0);
	this.layer.resizeWorld();

	this.player = game.add.sprite(144, 128, 'player');
	game.physics.enable(this.player,Phaser.Physics.ARCADE);
	//this.player.anchor.set(0.5);
	this.player.body.setSize(32, 32, 0, 32);
	game.physics.arcade.collide(this.player, this.layer);
	game.camera.follow(this.player);
	
	//setup the input
	this.input.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.input.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.input.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.input.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.input.confirmKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
};

testState.prototype.update = function()
{
	game.physics.arcade.collide(this.player, this.layer);
	//this.player.body.velocity.x = 150;

	//player movement and input
	this.player.body.velocity.x = 0;
	this.player.body.velocity.y = 0;
	if(this.input.upKey.isDown)
	{
		this.player.body.velocity.y = -120;
	}
	else if (this.input.downKey.isDown)
	{
		this.player.body.velocity.y = 120;
	}
	if(this.input.leftKey.isDown)
	{
		this.player.body.velocity.x = -120;
	}
	else if (this.input.rightKey.isDown)
	{
		this.player.body.velocity.x = 120;
	}

	if (this.input.confirmKey.isDown)
	{
		console.log(this.player);
	}

	//Keep the position as intergers to make the rendering not blur out
	this.player.body.x = Math.round(this.player.body.x);
	this.player.body.y = Math.round(this.player.body.y);

	if (this.player.body.y > 350)
	{
		game.state.add('game', testStateOutside, true);
	}
};*/

/*testState.prototype.render = function()
{
	//game.debug.body(this.player);
	//game.debug.body(this.layer);
	//game.debug.cameraInfo(game.camera, 32, 32);
};*/

/*TEST STATE Outside*/
var testStateOutside = function(){};

testStateOutside.prototype.preload = function()
{
	game.load.tilemap('testStateOutsideLevel', 'assets/tilemaps/testoutside.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testStateOutsideTiles', 'assets/tilesets/test-tiles-outside.png');
	game.load.image('player', 'assets/graphics/test-player.png');
	game.load.image('enemy1', 'assets/graphics/enemy1.png');
	game.load.image('enemy2', 'assets/graphics/enemy2.png');
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

	//Setup player
	this.player = game.add.sprite(176, 96, 'player');
	game.camera.follow(this.player);
	
	//setup the input
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	confirmKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

	//setup map entities
	this.mapEntities = game.add.group();
	this.mapEntities.sort();
	this.mapEntities.add(this.player);
	this.mapEntities.player = this.player;
	
	this.map.createFromObjects('Object Layer 1', 12, 'medpack', '', true, false, this.mapEntities);
	this.map.createFromObjects('Object Layer 1', 14, 'enemy1', '', true, false, this.mapEntities);
	this.map.createFromObjects('Object Layer 1', 15, 'enemy2', '', true, false, this.mapEntities);

	for (var i = 0; i < this.mapEntities.children.length; i++)
	{
		game.physics.enable(this.mapEntities.getAt(i),Phaser.Physics.ARCADE);
		

		if (this.mapEntities.getAt(i).key == 'player')
		{
			this.mapEntities.getAt(i).attackCountdown = 0;
			this.mapEntities.getAt(i).stepInsideEntity = playerStep;
			this.mapEntities.getAt(i).health = 400;
			this.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
		}
		if (this.mapEntities.getAt(i).key == 'medpack')
		{
			this.mapEntities.getAt(i).stepInsideEntity = medpackStep;
			this.mapEntities.getAt(i).body.setSize(32, 32, 0, 0);
			this.mapEntities.getAt(i).health = 10;
		}
		if (this.mapEntities.getAt(i).key == 'enemy1')
		{
			this.mapEntities.getAt(i).state = 'waiting';
			this.mapEntities.getAt(i).searchX = this.mapEntities.getAt(i).x;
			this.mapEntities.getAt(i).searchY = this.mapEntities.getAt(i).y;
			this.mapEntities.getAt(i).stepInsideEntity = enemy1Step;
			this.mapEntities.getAt(i).health = 20;
			this.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
		}

		if (this.mapEntities.getAt(i).key == 'enemy2')
		{
			this.mapEntities.getAt(i).state = 'waiting';
			this.mapEntities.getAt(i).searchX = this.mapEntities.getAt(i).x;
			this.mapEntities.getAt(i).searchY = this.mapEntities.getAt(i).y;
			this.mapEntities.getAt(i).jumpCountdown = 0;
			this.mapEntities.getAt(i).jumpAngle = 0;
			this.mapEntities.getAt(i).jumpX = 0;
			this.mapEntities.getAt(i).jumpY = 0;
			this.mapEntities.getAt(i).stepInsideEntity = enemy2Step;
			this.mapEntities.getAt(i).health = 60;
			this.mapEntities.getAt(i).body.setSize(32, 32, 0, 32);
		}

	}

	//setup hud
	this.displayText = game.add.text(20, 20, 'Health:\nArrows to move, \'Z\' to attack',{ font: '16px Courier', fill: '#FFFFFF', align: 'left' });
	this.displayText.fixedToCamera = true;
	this.displayText.cameraOffset.x = 20;
	this.displayText.cameraOffset.y = 20;

	this.graphicsObject = game.add.graphics(0,0);
	this.graphicsObject.fixedToCamera = true;
	this.graphicsObject.cameraOffset.x = 0;
	this.graphicsObject.cameraOffset.y = 0;

};

testStateOutside.prototype.update = function()
{
	game.physics.arcade.collide(this.mapEntities, this.mapEntities,function(left,right)
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

		//player and health
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
	game.physics.arcade.overlap(this.mapEntities, this.mapEntities,function(left,right)
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
	//game.physics.arcade.collide(this.mapEntities, this.swingAttack, function(left,right){console.log('attack hit');left.kill();});
	game.physics.arcade.collide(this.mapEntities, this.layer);

	this.mapEntities.setAll('body.velocity.x',0);
	this.mapEntities.setAll('body.velocity.y',0);

	//Update Entities stepInsideAi
	this.mapEntities.callAll('stepInsideEntity');

	//Do the depth sort
	this.mapEntities.sort('y', Phaser.Group.SORT_ASCENDING);

	//update text
	this.displayText.setText('Health:\nArrows to move, \'Z\' to attack');
	this.graphicsObject.clear();
	this.graphicsObject.beginFill(0x2c8336);
	this.graphicsObject.drawRect(100, 18, 400, 18);
	this.graphicsObject.beginFill(0x3fd150);
	this.graphicsObject.drawRect(100, 18, this.player.health, 18);

};


testStateOutside.prototype.render = function()
{
	
	/*for (var i = 0; i < this.mapEntities.children.length; i++)
	{
		game.debug.body(this.mapEntities.getAt(i));

		if (this.mapEntities.getAt(i).key == 'enemy2')
		{
			game.debug.text(this.mapEntities.getAt(i).state, 100, 380 );
		}
	}/**/
	//game.debug.cameraInfo(game.camera, 32, 32);
	
	//game.debug.text('Arrows to move,\'Z\' to attack', 30, 30 );
	//game.debug.text('Health: '+this.player.health, 30, 50 );
};

function playerStep()
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
	if (this.healthValue === 0)
	{
		this.destroy();
	}

	this.healthValue--;
}

function medpackStep()
{
	if (this.health === 0)
	{
		this.destroy();
	}
}

function enemy1Step()
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

function enemy2Step()
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

//game.state.add('game', testState, true);
game.state.add('game', testStateOutside, true);