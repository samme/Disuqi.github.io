export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'finn');
        scene.physics.add.existing(this);
    }

    animate() {
        this.play('idle', true);
    }
}