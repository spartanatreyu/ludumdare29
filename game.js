/*jslint node: true */
'use strict';

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

/*TEST STATE*/
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

	/*Keep the position as intergers to make the rendering not blur out*/
	this.player.body.x = Math.round(this.player.body.x);
	this.player.body.y = Math.round(this.player.body.y);

	if (this.player.body.y > 350)
	{
		game.state.add('game', testStateOutside, true);
	}
};

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
};

testStateOutside.prototype.create = function()
{
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Setup Level
	this.map = game.add.tilemap('testStateOutsideLevel');
	this.map.addTilesetImage('test-tiles-outside', 'testStateOutsideTiles', 32, 32);
	this.map.setCollision([1,2,3]);

	this.layer = this.map.createLayer(0);
	this.layer.resizeWorld();

	//Setup player
	this.player = game.add.sprite(176, 96, 'player');
	game.physics.enable(this.player,Phaser.Physics.ARCADE);
	this.player.body.setSize(32, 32, 0, 32);
	game.physics.arcade.collide(this.player, this.layer);
	game.camera.follow(this.player);
	
	//setup the input
	this.input.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.input.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.input.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.input.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.input.confirmKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

	//setup map entities
	this.mapEntities = game.add.group();
	this.mapEntities.sort();
	this.mapEntities.add(this.player);

	this.enemy = game.add.sprite(192, 242, 'enemy1');
	game.physics.enable(this.enemy,Phaser.Physics.ARCADE);
	this.enemy.body.setSize(32, 32, 0, 32);
	this.mapEntities.add(this.enemy);

};

testStateOutside.prototype.update = function()
{
	game.physics.arcade.collide(this.player, this.layer);
	game.physics.arcade.collide(this.enemy, this.layer);
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
		
	}

	this.pointToPlayer = game.math.angleBetween(this.enemy.x, this.enemy.y,this.player.x, this.player.y);

	/*Keep the position as intergers to make the rendering not blur out*/
	this.player.body.x = Math.round(this.player.body.x);
	this.player.body.y = Math.round(this.player.body.y);

	//Update Entities
	this.enemy.body.velocity.x = Math.sin(this.pointToPlayer) * 30;
    this.enemy.body.velocity.y = Math.cos(this.pointToPlayer) * 30;

	//Do the depth sort
	this.mapEntities.sort('y', Phaser.Group.SORT_ASCENDING);

	

};
/*
testStateOutside.prototype.render = function()
{
	game.debug.body(this.player);
	game.debug.body(this.enemy);
	game.debug.text(this.pointToPlayer, 100, 380 );
	//game.debug.body(this.layer);
	//game.debug.cameraInfo(game.camera, 32, 32);
};
*/
//game.state.add('game', testState, true);
game.state.add('game', testStateOutside, true);