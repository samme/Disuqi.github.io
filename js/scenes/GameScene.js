import { CTS } from "../CTS.js";

export class GameScene extends Phaser.Scene {

    //fields
    score;
    hasKey;
    level;
    controlsOFF;
    gameOver;
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
        this.gameOver = false;
    }

    create() {
        //Create Platforms background and items in the level
        this.platforms = this.physics.add.staticGroup();
        this.createLevel(this);
        //arrowKeys
        this.createArrowKeys()
            //score
            // this.scoreText = this.add.text(16, 16, 'Score:0', { fontSize: '32px', fill: '#ccffff', fontFamily: 'Arcade Interlaced' });
            //player
        this.player = this.physics.add.sprite(600, 620, 'finn').setScale(2);
        this.player.setCollideWorldBounds(true);
        //animations
        this.createAnimations();
        //collissions and overlaps
        this.createColliders()
    }

    update() {
        if (this.gameOver || this.controlsOFF) {
            return;
        }
        if (this.ladder.body.touching.none && !this.ladder.body.wasTouching.none) {
            this.climbing = false;
        }
        if (this.computer.body.touching.none && this.readComputerText != null) {
            this.readComputerText.visible = false;
        }
        //movement left right and jump
        this.movePlayer();
        //arrowKeys image
        this.updateKeysImage();
    }
    movePlayer() {
        //left, right and idle
        if (this.climbing) {
            return;
        }
        if (this.cursors.left.isDown || this.cursors.a.isDown) {
            this.run(-1);
            this.player.anims.play('run', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.cursors.d.isDown) {
            this.run(1);
            this.player.anims.play('run', true);
            this.player.resetFlip();
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
    }
    updateKeysImage() {
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

    openDoor(player, door) {
        if (this.hasKey == true && this.player.body.blocked.down) {
            this.house.setFrame(1)
            this.controlsOFF = true;
            this.level += 1;
            this.createLevel(this);
        }
    }

    getKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

    }

    climbLadder(player, ladder) {
        if (this.cursors.up.isDown && this.player.body.blocked.down && !this.climbing) {
            this.player.y -= 5;
            this.player.x = this.ladder.x;
            this.climbing = true;
        } else if (this.player.body.blocked.down) {
            this.climbing = false;
        }
        if (!this.climbing) {
            return;
        }
        if (this.cursors.up.isDown) {
            this.climb(-1);
        } else if (this.cursors.down.isDown) {
            this.climb(1);
        } else {
            this.player.anims.stop();
            this.player.setVelocityY(0);
        }

    }
    climb(direction) {
        this.player.anims.play('climb', true);
        this.player.setVelocityY(150 * direction);
    }

    turnOnComputer(player, computer) {
        if (!this.computerOn) {
            computer.anims.play('computerOn', true);
            computer.on('animationcomplete', () => {
                this.readComputerText = this.add.text(105, 400, 'Press S or ↓ to read', { fontSize: '24px', fill: '#41FF00', backgroundColor: '#3b4566', padding: 10, fontFamily: 'Cascadia Code' });
            })
            this.computerOn = true;
        } else if (this.readComputerText != null) {
            this.readComputerText.visible = true;
            if (this.cursors.down.isDown || this.cursors.s.isDown) {
                this.readComputer();
            }
        }
    }

    readComputer() {
        if (!this.lookingAtMonitor) {
            if (this.monitor == null) {
                this.monitor = this.physics.add.image(0, 0, 'monitor');
                this.monitor.setScale(0.67);
                this.monitor.setOrigin(0, 0);
                this.monitor.setDepth(2);
                this.monitor.body.allowGravity = false;
            } else {
                this.monitor.visible = true;
            }
            this.lookingAtMonitor = true;
        } else {
            this.monitor.visible = false;
            this.lookingAtMonitor = false;
        }
    }


    createLevel(game) {
        this.platforms.clear(true, true);
        switch (this.level) {
            case 0:
                //Background
                this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(4.5);
                //House
                this.house = this.physics.add.image(1050, 520, 'house');
                this.house.body.allowGravity = false;
                this.house.body.setSize(50, 80, true);
                this.house.body.setOffset(52, 157);
                //Ladder
                this.ladder = this.physics.add.image(875, 577, 'ladder');
                this.ladder.body.allowGravity = false;
                this.ladder.setScale(0.45, 0.5);
                this.ladder.setImmovable(true);
                //Computer
                this.computer = this.physics.add.sprite(250, 550, 'computer');
                this.computer.setScale(0.5);
                this.computer.toggleFlipX();
                this.computer.body.allowGravity = false;
                this.computerOn = false;
                this.physics.add.image()
                this.platforms.create(480, 680, 'ground');
                this.platforms.create(1446, 680, 'ground');
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
                });
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

    createArrowKeys() {
        this.arrowKeys = this.physics.add.staticGroup();
        this.up = this.arrowKeys.create(200, 200, 'w');
        this.left = this.arrowKeys.create(140, 260, 'a');
        this.down = this.arrowKeys.create(200, 260, 's');
        this.right = this.arrowKeys.create(260, 260, 'd');
        const listOfArrows = [this.up, this.down, this.left, this.right]
        listOfArrows.forEach(arrow => arrow.setScale(0.6));
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.a = this.input.keyboard.addKey('A', true, true);
        this.cursors.s = this.input.keyboard.addKey('S', true, true);
        this.cursors.d = this.input.keyboard.addKey('D', true, true);
        this.cursors.w = this.input.keyboard.addKey('W', true, true);
    }

    createAnimations() {
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
            frameRate: 4
        })
        this.anims.create({
            key: 'computerOn',
            frames: this.anims.generateFrameNumbers('computer', { start: 0, end: 10 }),
            frameRate: 5,
        });
    }

    checkPlayerY() {
        if (this.player.y > this.ladder.y - 50 && !this.climbing) {
            return false;
        } else {
            return true;
        }
    }

    createColliders() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.ladder, null, this.checkPlayerY, this);
        this.physics.add.overlap(this.player, this.house, this.openDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null, this);
        this.physics.add.overlap(this.player, this.ladder, this.climbLadder, null, this);
        this.physics.add.overlap(this.player, this.computer, this.turnOnComputer, null, this);
    }
}