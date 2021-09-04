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
        const buttons = [startButton, levelButton, contactMe]
        const buttonMap = new Map()
        buttonMap.set(startButton, CTS.SCENES.GAME)
        buttonMap.set(levelButton, CTS.SCENES.GAME)
        buttonMap.set(contactMe, CTS.SCENES.GAME)
        buttons.forEach(button => {
            button.setInteractive();
            button.on('pointerover', () => {
                button.setScale(1.1);
            })
            button.on('pointerout', () => {
                button.setScale(1);
            })
            button.on('pointerup', () => {
                this.scene.start(buttonMap.get(button));
            })
        });
    }

}