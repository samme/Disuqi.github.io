import { CTS } from "../CTS.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CTS.SCENES.MENU
        })
    }
    init() {}
    create() {
        this.add.image(0, 0, 'menuBg').setOrigin(0).setScale(1.3);

        let startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 - 50, 'startButton');
        let levelButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, 'levelButton');
        let contactMe = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150, 'contactMe');

        startButton.setInteractive();
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
        })
        startButton.on('pointerout', () => {
            startButton.setScale(1);
        })
        startButton.on('pointerup', () => {
            this.scene.start(CTS.SCENES.GAME);
        })
    }

}