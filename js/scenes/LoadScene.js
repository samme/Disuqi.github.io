import { CTS } from "../CTS.js";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CTS.SCENES.LOAD
        })
    }
    preload() {
        this.load.image('background', 'images/level1/background.jpg');
        this.load.image('ground', 'images/level1/ground.png');
        this.load.image('platform', 'images/level1/grass_4x1.png');
        this.load.image('coin', 'images/level1/coin.png');
        this.load.image('key', 'images/key.png');
        this.load.image('house', 'images/level1/house.png')
        this.load.image('startButton', 'images/menu/startButton.png')
        this.load.image('levelButton', 'images/menu/levelButton.png')
        this.load.image('contactMe', 'images/menu/contactMe.png')
        this.load.image('menuBg', 'images/menu/chipBackground.jpg')
        this.load.spritesheet('door', 'images/level1/door.png', { frameWidth: 70, frameHeight: 93 })
        this.load.spritesheet('player', 'images/FinnSprite.png', { frameWidth: 15, frameHeight: 20, margin: 6, spacing: 17 });

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })
        this.load.on('progress', (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }
    create() {
        this.scene.start(CTS.SCENES.MENU)
    }
}