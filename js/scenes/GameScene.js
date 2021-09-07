import { CTS } from "../CTS.js";

export class GameScene extends Phaser.Scene {

    //fields
    score;
    hasKey;
    level;
    controlsOFF;
    //Text
    welcome;
    aboutMe;

    constructor() {
        super({
            key: CTS.SCENES.GAME
        })
        this.score = 0;
        this.hasKey = false;
        this.level = 0;
        this.controlsOFF = false;
        this.welcome = 'Welcome to my Website!\nMy name is Disuqi Hijazi, I am a university student.\n' +
            'I go to Salford University and I am studying computer science\n' +
            'This webstie is all about me, my projects, education, work experience\n' +
            'but you have to play the game to see all the information!\n' +
            'I Hope you\'ll like it!';
        this.aboutMe = 'I am a hardworking, reliable, and responsible individual who is confident and enjoys taking on challenges\n' +
            'and actively working on any criticism I may receive.\n' +
            'Ambitious and diligent in all my work to ensure any given tasks are completed in the best quality manner.\n' +
            'I am capable and happy to work independently or unsupervised. Moreover, I am friendly and compassionate\n' +
            'which enables me to remain level-headed and interact with customers to ensure the best experience is provided.\n' +
            'I am currently a student at Salford University, studying computer science and looking for an internship or part-time job in the Technological industry.';
    }

    create() {
        //background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.67);

        //arrowKeys
        this.arrowKeys = this.physics.add.staticGroup();
        this.up = this.arrowKeys.create(200, 200, 'upNotPressed');
        this.left = this.arrowKeys.create(140, 260, 'leftNotPressed');
        this.down = this.arrowKeys.create(200, 260, 'downNotPressed');
        this.right = this.arrowKeys.create(260, 260, 'rightNotPressed');
        const listOfArrows = [this.up, this.down, this.left, this.right]
        listOfArrows.forEach(arrow => arrow.setScale(4));

        //key
        this.key = this.physics.add.image(1170, 400, 'key');
        this.key.setDepth(1);
        this.key.setScale(0.05);
        this.key.body.allowGravity = false;
        this.tweens.add({
            targets: this.key,
            y: '+=10',
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1,
        })

        //platforms
        this.platforms = this.physics.add.staticGroup();
        this.createLevel(this);

        //coins
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.coins.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(0.7);
        });

        //  score
        this.scoreText = this.add.text(16, 16, 'Score:0', { fontSize: '32px', fill: '#ccffff', fontFamily: 'Arcade Interlaced' });

        //players
        this.player = this.physics.add.sprite(100, 450, 'player').setScale(2);
        this.player.setCollideWorldBounds(true);

        //All animations
        //  player animations
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
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.house, this.openDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null, this);
        this.physics.add.overlap(this.player, this.ladder, this.climbLadder, null, this);

        //keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.gameOver = false;
    }

    update() {
        if (this.gameOver || this.controlsOFF) {
            return;
        }
        //left, right and idle
        if (this.cursors.left.isDown) {
            this.run(-1);
            this.player.anims.play('run', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.run(1);
            this.player.anims.play('run', true);
            this.player.resetFlip();
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        //jumping
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-450);
        }

        //jump and fall animations
        if (this.player.body.velocity.y != 0) {
            this.player.anims.play('jump');
        }

        //arrowKeys image
        if (this.cursors.up.isDown) {
            this.up.setTexture('upPressed');
        } else {
            this.up.setTexture('upNotPressed');
        }
        if (this.cursors.down.isDown) {
            this.down.setTexture('downPressed');
        } else {
            this.down.setTexture('downNotPressed');
        }
        if (this.cursors.left.isDown) {
            this.left.setTexture('leftPressed')
        } else {
            this.left.setTexture('leftNotPressed');
        }
        if (this.cursors.right.isDown) {
            this.right.setTexture('rightPressed');
        } else {
            this.right.setTexture('rightNotPressed');
        }
    }
    run(direction) {
        this.player.setVelocityX(200 * direction);
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score:' + this.score);

        if (this.coins.countActive(true) == 0) {
            this.coins.children.iterate(function(child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }

    openDoor(player, door) {
        if (this.hasKey == true && this.player.body.blocked.down) {
            this.house.setFrame(1)
            this.controlsOFF = true;
            if (this.player.x > 925) {
                this.player.resetFlip();
                this.player.toggleFlipX();
            }
            this.player.anims.play('run', true);
            this.tweens.add({
                targets: this.player,
                x: 925,
                duration: Math.abs(this.player.x - 925 + 1000),
                ease: 'Linear',
            }).on('complete', () => {
                this.player.anims.play('idle', true);
            });
            this.level += 1;
            this.createLevel(this);
        } else {
            console.log('touched')
        }
    }

    getKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

    }

    climbLadder(player, ladder) {
        if (this.cursors.up.isDown) {
            this.player.y -= 1;
        }
    }

    createLevel(game) {
        this.platforms.clear(true, true);
        switch (this.level) {
            case 0:
                //House & door
                this.house = game.physics.add.image(1050, 520, 'house');
                this.house.body.allowGravity = false;
                this.house.body.setSize(50, 80, true);
                this.ladder = game.physics.add.image(1060, 570, 'ladder');
                this.ladder.body.allowGravity = false;
                this.ladder.setScale(0.5);
                var rect = this.add.graphics({
                    fillStyle: {
                        color: 0xffffff
                    }
                });
                this.house.body.drawDebug(rect);
                //const welcomeText = game.add.text(0, 50, this.welcome, { fontFamily: 'Munro', fontSize: '40px', color: '#ccffff', backgroundColor: '#5E6664', fixedWidth: 3000, padding: 20 })
                game.physics.add.image()
                this.platforms.create(480, 680, 'ground');
                this.platforms.create(1446, 680, 'ground');
                break;
            case 1:
                this.platforms.create(480, 680, 'ground');
                this.platforms.create(1446, 680, 'ground');
                this.platforms.create(85, 350, 'platform');
                this.platforms.create(197, 350, 'platform');
                this.platforms.create(500, 300, 'platform');
                this.platforms.create(100, 100, 'platform');
                break;
            default:
                this.platforms.create(480, 680, 'ground');
                this.platforms.create(1446, 680, 'ground');
                this.platforms.create(85, 350, 'platform');
                this.platforms.create(197, 350, 'platform');
                this.platforms.create(500, 200, 'platform');
                break;
        }
    }
}