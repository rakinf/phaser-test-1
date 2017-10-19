var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var player;

//SCORES
var score = 0;
var scoreText;

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

  //enabling keyboard input
  cursors = game.input.keyboard.createCursorKeys();

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

  //STARS
  stars = game.add.group();
  stars.enableBody = true;
  //create 12 stars evenly spaced
  for (var i = 0; i < 12; i++) {
    //create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');
    star.body.gravity.y = 6;
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //SCORES
  scoreText = game.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000'
  });
}

function update() {
  //collision check player and platform
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  //collision check star and platform
  game.physics.arcade.collide(stars, platforms);
  //overlap check player and stars
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  //SET PLAYER KEYBOARD CONTROLS
  //reset the player velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //move to the left
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    //move to the right
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else {
    //stand still
    player.animations.stop();
    player.frame = 4;
  }
  //allow the player to jump uf they are touching the ground
  if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
    player.body.velocity.y = -350;
  }
}

function collectStar(player, star) {
  //removes the star from the screen
  star.kill();

  //add and update the score
  score += 1;
  scoreText.text = 'Score: ' + score;
}
