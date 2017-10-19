var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
  //enabling physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //adding background
  game.add.sprite(0, 0, 'sky');

  //PLATFORMS
  //create platforms as group
  platforms = game.add.group();
  //enable physics for any object that is created in this group
  platforms.enableBody = true;
  //create the ground
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  //scale it twice the original (400x32) size to fit the width of the game
  ground.scale.setTo(2, 2);
  //make it so it not falling away when being step on
  ground.body.immovable = true;
  //create two ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  //PLAYER
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  //enabling physics to player
  game.physics.arcade.enable(player);
  //player physics properties
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //add left and right walking animations
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function update() {
  //colllision check
  var hitPlatform = game.physics.arcade.collide(player, platforms);
}
