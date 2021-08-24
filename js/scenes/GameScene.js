import { CTS } from "../CTS.js";

export class GameScene extends Phaser.Scene {

    //fields
    score = 0;
    scoreText = null;
    hasKey = false;
    level = 0;
    door = null;
    cursors = null;
    player = null;
    coins = null;
    platforms = null;
    //Text
    welcome = 'Welcome to my Website!\nMy name is Disuqi Hijazi, I am a university student.\n' +
        'I go to Salford University and I am studying computer science\n' +
        'This webstie is all about me, my projects, education, work experience\n' +
        'but you have to play the game to see all the information!\n' +
        'I Hope you\'ll like it!';
    aboutMe = 'I am a hardworking, reliable, and responsible individual who is confident and enjoys taking on challenges\n' +
        'and actively working on any criticism I may receive.\n' +
        'Ambitious and diligent in all my work to ensure any given tasks are completed in the best quality manner.\n' +
        'I am capable and happy to work independently or unsupervised. Moreover, I am friendly and compassionate\n' +
        'which enables me to remain level-headed and interact with customers to ensure the best experience is provided.\n' +
        'I am currently a student at Salford University, studying computer science and looking for an internship or part-time job in the Technological industry.';

    constructor() {
        super({
            key: CTS.SCENES.GAME
        })
    }

    create() {
        //background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.67);

        //key
        let key = this.physics.add.image(800, 590, 'key');
        key.setScale(0.05);
        key.body.allowGravity = false;
        this.tweens.add({
            targets: key,
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

        // Text group

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
        this.physics.add.overlap(this.player, this.door, this.openDoor, null, this);
        this.physics.add.overlap(this.player, key, this.getKey, null, this);

        //keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.gameOver = false;
    }

    update() {
        if (this.gameOver) {
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
            door.setFrame(1)
            this.player.anims.play('die');
            this.level += 1;
            this.createLevel(this);
        }
    }

    getKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;

    }

    createLevel(game) {
        this.platforms.clear(true, true);
        switch (this.level) {
            case 0:
                //House & door
                let house = game.physics.add.image(200, 520, 'house');
                house.body.allowGravity = false;
                this.door = game.physics.add.image(330, 600, 'door');
                this.door.setScale(0.9);
                this.door.body.allowGravity = false;
                const welcomeText = game.add.text(0, 50, this.welcome, { fontFamily: 'Munro', fontSize: '40px', color: '#ccffff', backgroundColor: '#5E6664', fixedWidth: 3000, padding: 20 })
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