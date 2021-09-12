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
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(4.5);

        //arrowKeys
        this.arrowKeys = this.physics.add.staticGroup();
        this.up = this.arrowKeys.create(200, 200, 'w');
        this.left = this.arrowKeys.create(140, 260, 'a');
        this.down = this.arrowKeys.create(200, 260, 's');
        this.right = this.arrowKeys.create(260, 260, 'd');
        const listOfArrows = [this.up, this.down, this.left, this.right]
        listOfArrows.forEach(arrow => arrow.setScale(0.6));

        //key
        this.key = this.physics.add.image(1170, 350, 'key');
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

        //player
        this.player = this.physics.add.sprite(10, 620, 'finn').setScale(2);
        this.player.setCollideWorldBounds(true);

        //All animations
        //  player animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('finn', { start: 9, end: 14 }),
            frameRate: 8,
            repeat: -1,
        }, );
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('finn', { start: 0, end: 8 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'finn', frame: 15 }],
        })
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('finn', { start: 19, end: 23 }),
            frameRate: 8,
        })
        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('finn', { start: 17, end: 18 }),
            frameRate: 6,
        });
        this.anims.create({
            key: 'lookBack',
            frames: [{ key: 'finn', frame: 28 }]
        })
        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers('finn', { start: 29, end: 30 }),
            frameRate: 8
        })
        this.anims.create({
            key: 'computerOn',
            frames: this.anims.generateFrameNumbers('computer', { start: 0, end: 10 }),
            frameRate: 6,
        });


        //collissions and overlaps
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.house, this.openDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null, this);
        this.physics.add.overlap(this.player, this.ladder, this.climbLadder, null, this);
        this.physics.add.overlap(this.player, this.computer, this.turnOnComputer, null, this);

        //keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.a = this.input.keyboard.addKey('A', true, true);
        this.cursors.s = this.input.keyboard.addKey('S', true, true);
        this.cursors.d = this.input.keyboard.addKey('D', true, true);
        this.cursors.w = this.input.keyboard.addKey('W', true, true);
        this.gameOver = false;
    }

    update() {
        if (this.gameOver || this.controlsOFF) {
            return;
        }
        if (this.ladder.body.touching.none && !this.ladder.body.wasTouching.none) {
            this.climbing = false;
        }
        if (!this.climbing) {
            this.player.body.allowGravity = true;
        }
        //left, right and idle
        if (this.cursors.left.isDown || this.cursors.a.isDown) {
            this.run(-1);
            this.player.anims.play('run', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.cursors.d.isDown) {
            this.run(1);
            this.player.anims.play('run', true);
            this.player.resetFlip();
        } else if (this.cursors.down.isDown || this.cursors.s.isDown) {
            this.player.anims.play('lookBack', true);
            this.player.setVelocityX(0);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        //jumping
        if ((this.cursors.up.isDown || this.cursors.w.isDown) && this.player.body.blocked.down && !this.climbing) {
            this.player.setVelocityY(-450);
        }

        //jump and fall animations
        if (this.player.body.velocity.y != 0 && !this.climbing) {
            this.player.anims.play('jump');
        }
        if (this.climbing) {
            this.player.anims.play('climb', true);
        }
        //arrowKeys image
        this.changeKeysImage();
    }
    changeKeysImage() {
        if (this.cursors.up.isDown || this.cursors.w.isDown) {
            this.up.setTexture('wP');
            this.up.x = 203;
            this.up.y = 203;
        } else {
            this.up.setTexture('w');
            this.up.x = 200;
            this.up.y = 200;
        }
        if (this.cursors.down.isDown || this.cursors.s.isDown) {
            this.down.setTexture('sP');
            this.down.x = 203;
            this.down.y = 263;
        } else {
            this.down.setTexture('s');
            this.down.x = 200;
            this.down.y = 260;
        }
        if (this.cursors.left.isDown || this.cursors.a.isDown) {
            this.left.setTexture('aP')
            this.left.x = 143;
            this.left.y = 263;
        } else {
            this.left.setTexture('a');
            this.left.x = 140;
            this.left.y = 260;
        }
        if (this.cursors.right.isDown || this.cursors.d.isDown) {
            this.right.setTexture('dP');
            this.right.x = 263;
            this.right.y = 263;
        } else {
            this.right.setTexture('d');
            this.right.x = 260;
            this.right.y = 260;
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
            this.player.anims.play('climb', true);
            this.player.y -= 3;
            this.player.body.allowGravity = false;
            this.climbing = true;
        }

    }
    turnOnComputer(player, computer) {
        if (!this.computerOn) {
            computer.anims.play('computerOn', true);
            this.computerOn = true;
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
                this.computer = game.physics.add.sprite(250, 550, 'computer');
                this.computer.setScale(0.5);
                this.computer.toggleFlipX();
                this.computer.body.allowGravity = false;
                this.computerOn = false;

                var rect = this.add.graphics({
                    fillStyle: {
                        color: 0xffffff
                    }
                });
                //doesnt work properly
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