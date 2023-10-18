let game;

const gameOptions = {
    playerSpeed: 200
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width : 640,
            height: 960,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 500
                }
            }
        },
        scene: [MainMenu, PlayGame, GameOver]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("backgroundBrown", "assets/Background/Brown.png");
        this.load.image("backgroundBlue", "assets/Background/Blue.png");
        this.load.image("backgroundGray", "assets/Background/Gray.png");
        this.load.spritesheet("terrain", "assets/Terrain (16x16).png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("Mask Dude Idle", "assets/Mask Dude/Idle (32x32).png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Mask Dude Run", "assets/Mask Dude/Run (32x32).png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Mask Dude Jump", "assets/Mask Dude/Jump (32x32).png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Mask Dude Fall", "assets/Mask Dude/Fall (32x32).png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Melon", "assets/Fruits/Melon.png", {frameWidth: 32, frameHeight: 32});

        this.load.audio("jump", "assets/sfx/Retro Jump Classic 08.wav");
        this.load.audio("collect fruit", "assets/sfx/Retro PickUp Coin 07.wav");
    }

    create() {
        let x = 32;
        let y = 32;

        for (let i = 0; i < (game.config.height / 64); i++) {
            for(let j = 0; j < (game.config.width / 64); j++) {
                this.add.image(x, y, "backgroundBrown");
                x += 64;
            }
            x = 32;
            y += 64;
        }

        this.add.text(game.config.width / 2, game.config.height / 2, "Infinite Jumper", {fontSize: "48px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Select Level", {fontSize: "30px", fill: "#ffffff"}).setOrigin(1);
        this.add.text(game.config.width / 2, game.config.height / 2 + 128, "Level ONE", {fontSize: "30px", fill: "#ffffff"}).setOrigin(1);

        this.input.keyboard.once("keydown-ONE", () => {
            this.scene.start("PlayGame");
        })

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("Mask Dude Idle", {start: 0, end: 10}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("Mask Dude Run", {start: 0, end: 10}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: [{key: "Mask Dude Jump", frame: 0}],
            frameRate: 20,
        });

        this.anims.create({
            key: "fall",
            frames: [{key: "Mask Dude Fall", frame: 0}],
            frameRate: 20,
        });

        this.anims.create({
            key: "melon",
            frames: this.anims.generateFrameNumbers("Melon", {start: 0, end: 16}),
            frameRate: 20,
            repeat: -1
        });
    }
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
    }

    init() {
        this.score = 0;
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        let x = 32;
        let y = 32;

        for (let i = 0; i < (game.config.height / 64); i++) {
            for(let j = 0; j < (game.config.width / 64); j++) {
                this.add.image(x, y, "backgroundBlue");
                x += 64;
            }
            x = 32;
            y += 64;
        }

        this.terrainGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, game.config.width);
            const y = 30 * i;

            this.terrainGroup.create(x, y, "terrain", 193);
            this.terrainGroup.create(x + 16, y, "terrain", 194);
            this.terrainGroup.create(x + 32, y, "terrain", 194);
            this.terrainGroup.create(x + 48, y, "terrain", 194);
            this.terrainGroup.create(x + 64, y, "terrain", 194);
            this.terrainGroup.create(x + 80, y, "terrain", 195);
        }

        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "Mask Dude Idle");
        this.physics.add.collider(this.player, this.terrainGroup);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.fruitGroup = this.physics.add.group({});
        this.physics.add.collider(this.fruitGroup, this.terrainGroup);

        this.physics.add.overlap(this.player, this.fruitGroup, this.collectFruit, null, this);

        this.scoreText = this.add.text(16, 3, "Score: 0", {fontSize: "30px", fill: "#ffffff"});

        this.triggerTimer = this.time.addEvent({
            callback: this.addTerrain,
            callbackScope: this,
            delay: 1000,
            loop: true
        });
    }

    addTerrain() {

        const x = Phaser.Math.Between(0, game.config.width);

        this.terrainGroup.create(x, 0, "terrain", 193);
        this.terrainGroup.create(x + 16, 0, "terrain", 194);
        this.terrainGroup.create(x + 32, 0, "terrain", 194);
        this.terrainGroup.create(x + 48, 0, "terrain", 194);
        this.terrainGroup.create(x + 64, 0, "terrain", 194);
        this.terrainGroup.create(x + 80, 0, "terrain", 195);

        this.terrainGroup.setVelocityY(gameOptions.playerSpeed / 6);

        if(Phaser.Math.Between(0, 1)) {
            this.fruitGroup.create(Phaser.Math.Between(0, game.config.width), 0, "Melon").anims.play("melon", true);
        }
    }

    collectFruit(player, fruit) {
        fruit.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText("Score: " + this.score);
        this.sound.play("collect fruit");
    }

    update() {
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x = -gameOptions.playerSpeed;
            this.player.setFlipX(true);
            this.player.anims.play("run", true);
        } else if(this.cursors.right.isDown) {
            this.player.body.velocity.x = gameOptions.playerSpeed;
            this.player.setFlipX(false);
            this.player.anims.play("run", true);
        } else {
            this.player.body.velocity.x = 0;
            this.player.anims.play("idle", true);
        }

        if(this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -500 / 1.6;
            this.sound.play("jump");
        }

        if(this.player.body.velocity.y < 0) {
            this.player.anims.play("jump", true);
        } else if(this.player.body.velocity.y > 0 && !this.player.body.touching.down) {
            this.player.anims.play("fall", true);
        }

        if(this.player.y > game.config.height) {
            this.scene.start("GameOver");
        }
    }
}

class GameOver extends Phaser.Scene {

    constructor() {
        super("GameOver");
    }

    create() {
        let x = 32;
        let y = 32;

        for (let i = 0; i < (game.config.height / 64); i++) {
            for(let j = 0; j < (game.config.width / 64); j++) {
                this.add.image(x, y, "backgroundGray");
                x += 64;
            }
            x = 32;
            y += 64;
        }
        
        this.add.text(game.config.width / 2, game.config.height / 2, "Game Over!", {fontSize: "48px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 48, "Press SPACE to play again", {fontSize: "30px", fill: "#ffffff"}).setOrigin(0.5);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("PlayGame");
        });
    }
}