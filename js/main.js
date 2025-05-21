let player;
let coins;
let bombs;
let cursors;
let score = 0;
let scoreText;
console.log("Game Loaded");
function preload() {
  this.load.image('player', 'assets/player.jpeg');
  this.load.image('coin', 'assets/coin.jpeg');
  this.load.image('bomb', 'assets/bomb.jpeg');
  this.load.audio('coinSound', 'assets/coin.wav');
  this.load.audio('explosionSound', 'assets/explosion.wav');
}
let highScore = localStorage.getItem('coinCatcherHighScore') || 0;
function create() {
    score = 0;
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#000'
    });
  
    // High score text (move it lower so it's not on top of scoreText)
    this.highScoreText = this.add.text(16, 48, `High Score: ${highScore}`, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#444'
    });
  
      
    this.time.addEvent({
        delay: 5000,
        loop: true,
        callback: () => {
          coins.setVelocityY(coins.getChildren().length ? coins.getChildren()[0].body.velocity.y + 20 : 220);
          bombs.setVelocityY(bombs.getChildren().length ? bombs.getChildren()[0].body.velocity.y + 20 : 270);
        }
      });
      
    this.coinSound = this.sound.add('coinSound');
    this.explosionSound = this.sound.add('explosionSound');

    coinTimer = this.time.addEvent({
        delay: 1000,
        callback: spawnCoin,
        callbackScope: this,
        loop: true
      });
    
      bombTimer = this.time.addEvent({
        delay: 2500,
        callback: spawnBomb,
        callbackScope: this,
        loop: true
      });

  // Add player sprite
  player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
  player.setCollideWorldBounds(true);

  // Setup cursor input
  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-ESC', () => {
    exitGame.call(this);
  });
  
  // Group of coins
  coins = this.physics.add.group();
  bombs = this.physics.add.group();

  // Collisions
  this.physics.add.overlap(player, coins, collectCoin, null, this);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);
  
}
function exitGame() {
    this.physics.pause();
    coinTimer.remove();
    bombTimer.remove();
  
    coins.clear(true, true);
    bombs.clear(true, true);
    player.setVisible(false);
  
    // Thanks message
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 40, 'Thanks for playing!', {
      fontSize: '32px',
      fill: '#000',
      backgroundColor: '#ffffff',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
  
    // Restart button
    const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 30, 'Click to Restart', {
      fontSize: '28px',
      fill: '#ff0000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 10 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }
  
  
function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
  } else {
    player.setVelocityX(0);
  }
}

function spawnCoin() {
  const x = Phaser.Math.Between(50, 750);
  const coin = coins.create(x, 0, 'coin');
  coin.setVelocityY(200);
  coin.setScale(0.15);
}

function spawnBomb() {
  const x = Phaser.Math.Between(50, 750);
  const bomb = bombs.create(x, 0, 'bomb');
  bomb.setVelocityY(250);
  bomb.setScale(0.15);
}

function collectCoin(player, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
  this.coinSound.play();
}

function hitBomb(player, bomb) {
    
  this.cameras.main.shake(300);
  this.physics.pause();
  player.setTint(0xff0000);
  scoreText.setText('Game Over! Final Score: ' + score);
  // Stop the timers
  coinTimer.remove();
  bombTimer.remove();
  this.explosionSound.play();
  const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Click to Restart', {
    fontSize: '32px',
    fill: '#ff0000',
    backgroundColor: '#fff',
    padding: { x: 10, y: 10 }
  });
  restartButton.setOrigin(0.5); // centers anchor point
  restartButton.setInteractive();
  restartButton.on('pointerdown', () => {
    this.scene.restart();
  });  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('coinCatcherHighScore', highScore);
  }  
  const gameOverText = this.add.text(this.sys.game.config.width / 2, 100, `Game Over! Final Score: ${score}`, {
    fontFamily: 'Arial',
    fontSize: '28px',
    color: '#ff0000'
  });
  gameOverText.setOrigin(0.5);  
  scoreText.setStyle({ fontSize: '28px', color: '#ff0000' });
  scoreText.setPosition(20, 20);

}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  