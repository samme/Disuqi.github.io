const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: game,
    render: {
        pixelArt: true,
    },
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
    }
};

var game = new Phaser.Game(config);

//fields
let score = 0;
let scoreText;
let hasKey = false;
let level = 0;

function preload() {
    this.load.image('background', 'images/background.jpg');
    this.load.image('ground', 'images/ground.png');
    this.load.image('platform', 'images/grass_4x1.png');
    this.load.image('coin', 'images/coin.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.image('door', 'images/door.png');
    this.load.image('key', 'images/key.png');
    this.load.spritesheet('player', 'images/FinnSprite.png', { frameWidth: 15, frameHeight: 20, margin: 6, spacing: 17 });
}

function create() {
    //background
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.6);

    //door
    door = this.physics.add.image(200, 610, 'door');
    door.setScale(0.2);
    door.body.allowGravity = false;

    //key
    key = this.physics.add.image(800, 590, 'key');
    key.setScale(0.05);
    key.body.allowGravity = false;
    var tween = this.tweens.add({
            targets: key,
            y: '+=10',
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1,
        })
        //platforms
    platforms = this.physics.add.staticGroup();
    createLevel(level);

    //coins
    coins = this.physics.add.group({
        key: 'coin',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
    });
    coins.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.7);
    });
    //score
    scoreText = this.add.text(16, 16, 'Score:0', { fontSize: '32px', fill: '#139' });

    //bombs
    bombs = this.physics.add.group();

    //player & his animations
    player = this.physics.add.sprite(100, 450, 'player').setScale(2);

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 14 }),
        frameRate: 8,
        repeat: -1,
    }, );
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
        frameRate: 5,
        repeat: -1,
    });
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player', frame: 15 }],
    })
    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('player', { start: 19, end: 23 }),
        frameRate: 8,
    })
    this.anims.create({
        key: 'hit',
        frames: this.anims.generateFrameNumbers('player', { start: 17, end: 18 }),
        frameRate: 6,
    });

    //collissions and overlaps
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.overlap(player, door, openDoor, null, this);
    this.physics.add.overlap(player, key, getKey, null, this);

    //keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    this.gameOver = false;
}
let x = 0

function update() {

    if (this.gameOver) {
        return;
    }
    //left, right and idle
    if (cursors.left.isDown) {
        run(-1);
        player.anims.play('run', true);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        run(1);
        player.anims.play('run', true);
        player.resetFlip();
    } else {
        player.setVelocityX(0);

        player.anims.play('idle', true);
    }
    //jumping
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-450);
    }

    //jump and fall animations
    if (player.body.velocity.y != 0) {
        player.anims.play('jump');
    }

}

function run(direction) {
    player.setVelocityX(200 * direction);
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);

    score += 10;
    scoreText.setText('Score:' + score);

    if (coins.countActive(true) == 0) {
        coins.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.FloatBetween(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.anims.play('die');
    this.gameOver = true;
}

function openDoor(player, door) {
    if (hasKey == true && player.body.touching.down) {
        player.anims.play('die');
        level = 1;
        createLevel(level);
        console.log('touched')
    }
}

function getKey(player, key) {
    key.disableBody(true, true);
    hasKey = true;

}

function createLevel(currentlevel) {
    platforms.clear(true, true);
    switch (currentlevel) {
        case 0:
            platforms.create(480, 680, 'ground');
            platforms.create(1446, 680, 'ground');
            platforms.create(85, 350, 'platform');
            platforms.create(197, 350, 'platform');
            platforms.create(500, 200, 'platform');
        default:
            platforms.create(480, 680, 'ground');
            platforms.create(1446, 680, 'ground');
            platforms.create(85, 350, 'platform');
            platforms.create(197, 350, 'platform');
            platforms.create(500, 200, 'platform');
    }
}