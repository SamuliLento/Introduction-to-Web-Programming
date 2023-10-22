let game;

const gameOptions = {
    playerSpeed: 200,
    jumpPower: 300
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
        this.load.spritesheet("Mask Dude Hit", "assets/Mask Dude/Hit (32x32).png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Bananas", "assets/Fruits/Bananas.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("Melon", "assets/Fruits/Melon.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("Trampoline", "assets/Traps/Trampoline/Idle.png");
        this.load.spritesheet("Trampoline Jump", "assets/Traps/Trampoline/Jump (28x28).png", {frameWidth: 28, frameHeight: 28});
        this.load.image("Saw", "assets/Traps/Saw/Off.png");
        this.load.spritesheet("Saw On", "assets/Traps/Saw/On (38x38).png", {frameWidth: 38, frameHeight: 38});

        this.load.audio("jump", "assets/sfx/Retro Jump Classic 08.wav");
        this.load.audio("jumpTrampoline", "assets/sfx/Retro Jump Simple B 05.wav");
        this.load.audio("collect fruit", "assets/sfx/Retro PickUp Coin 07.wav");
        this.load.audio("sawHit", "assets/sfx/Retro Impact Metal 05.wav");
    }

    create() {

        //Create Menu background
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

        //Create Menu texts
        this.add.text(game.config.width / 2, game.config.height / 2, "Infinite Jumper", {fontSize: "48px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Press SPACE to play", {fontSize: "30px", fill: "#ffffff"}).setOrigin(0.5);

        //Create Menu inputs
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("PlayGame");
        })

        //Create animations for game objects
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
            key: "hit",
            frames: this.anims.generateFrameNumbers("Mask Dude Hit", {start: 0, end: 6}),
            frameRate: 20,
        });

        this.anims.create({
            key: "bananas",
            frames: this.anims.generateFrameNumbers("Bananas", {start: 0, end: 16}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "melon",
            frames: this.anims.generateFrameNumbers("Melon", {start: 0, end: 16}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "trampolineJump",
            frames: this.anims.generateFrameNumbers("Trampoline Jump", {start: 0, end: 7}),
            frameRate: 20,
        });

        this.anims.create({
            key: "sawOn",
            frames: this.anims.generateFrameNumbers("Saw On", {start: 0, end: 7}),
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

        //Create background for level
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

        //Create terrain group
        this.terrainGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        //Create initial platforms
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

        //Create player character
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "Mask Dude Idle");
        this.physics.add.collider(this.player, this.terrainGroup);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        //Create fruit group
        this.fruitGroup = this.physics.add.group();
        this.physics.add.collider(this.fruitGroup, this.terrainGroup);
        this.physics.add.overlap(this.player, this.fruitGroup, this.collectFruit, null, this);

        //Create trampoline group
        this.trampolineGroup = this.physics.add.group();
        this.physics.add.collider(this.trampolineGroup, this.terrainGroup);
        this.physics.add.overlap(this.player, this.trampolineGroup, this.jumpTrampoline, null, this);

        //Create saw group
        this.sawGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        this.physics.add.overlap(this.player, this.sawGroup, this.playerHit, null, this);

        //Create text for score
        this.scoreText = this.add.text(16, 3, "Score: 0", {fontSize: "30px", fill: "#ffffff"});

        //Call addTerrain every 1000ms
        this.triggerTimer = this.time.addEvent({
            callback: this.addTerrain,
            callbackScope: this,
            delay: 1000,
            loop: true
        });
    }

    //Spawn new game objects
    addTerrain() {

        const x = Phaser.Math.Between(0, game.config.width);

        //Spawn platforms
        this.terrainGroup.create(x, 0, "terrain", 193);
        this.terrainGroup.create(x + 16, 0, "terrain", 194);
        this.terrainGroup.create(x + 32, 0, "terrain", 194);
        this.terrainGroup.create(x + 48, 0, "terrain", 194);
        this.terrainGroup.create(x + 64, 0, "terrain", 194);
        this.terrainGroup.create(x + 80, 0, "terrain", 195);

        this.terrainGroup.setVelocityY(gameOptions.playerSpeed / 6);

        //Spawn trampolines on platforms
        if (Phaser.Math.Between(0, 4) == 1) {
            this.trampolineGroup.create(x + 40, -20, "Trampoline");
        }

        //Spawn saws left or right
        if (Phaser.Math.Between(0, 4) == 1) {
            if(Phaser.Math.Between(0, 1)) {
                this.sawGroup.create(0, -20, "Saw").anims.play("sawOn", true);
            } else {
                this.sawGroup.create(game.config.width, -20, "Saw").anims.play("sawOn", true);
            }
        }
        this.sawGroup.setVelocityY(gameOptions.playerSpeed / 6);

        //Spawn fruits
        if(Phaser.Math.Between(0, 1) == 1) {
            this.fruitGroup.create(Phaser.Math.Between(0, game.config.width), 0, "Melon").anims.play("melon", true);
        }
        if(Phaser.Math.Between(0, 3) == 1) {
            this.fruitGroup.create(Phaser.Math.Between(0, game.config.width), 0, "Bananas").anims.play("bananas", true);
        }
    }

    //Get points after player collects fruits
    collectFruit(player, fruit) {
        fruit.disableBody(true, true);
        if(fruit.texture.key == "Melon") {
            this.score += 1;
        } else if (fruit.texture.key == "Bananas") {
            this.score += 2;
        }
        this.scoreText.setText("Score: " + this.score);
        this.sound.play("collect fruit");
    }

    //Jump high when player hits trampoline
    jumpTrampoline(player, trampoline) {
        if(player.body.touching.down) {
            player.body.velocity.y = -gameOptions.jumpPower * 1.5;
            trampoline.anims.play("trampolineJump", true);
            this.sound.play("jumpTrampoline");
        }
    }

    //Lose player control and fall off when player gets hit
    playerHit(player, saw) {
        player.body.checkCollision.down = false;
        player.anims.play("hit", true);
        this.sound.play("sawHit");
    }

    update() {
        //Movement is disabled when player gets hit
        if(this.player.body.checkCollision.down) {
            //Move with player
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
    
            //Jump with player
            if((this.cursors.up.isDown && this.player.body.touching.down)) {
                this.player.body.velocity.y = -gameOptions.jumpPower;
                this.sound.play("jump");
            }
            
            //Play animation when player is jumping or falling
            if(this.player.body.velocity.y < 0) {
                this.player.anims.play("jump", true);
            } else if(this.player.body.velocity.y > 0 && !this.player.body.touching.down) {
                this.player.anims.play("fall", true);
            }
        }

        //Game ends when player falls off
        if(this.player.y > game.config.height) {
            this.scene.start("GameOver");
        }

        //Change saw move direction when it reaches edge of screen
        this.sawGroup.getChildren().forEach((saw) => {
            if(saw.x <= 0) {
                saw.setVelocityX(gameOptions.playerSpeed / 2);
            } else if(saw.x >= game.config.width) {
                saw.setVelocityX(-gameOptions.playerSpeed / 2);
            }
        });
    }
}

class GameOver extends Phaser.Scene {

    constructor() {
        super("GameOver");
    }

    create() {

        //Create Game Over background
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
        
        //Create Game Over texts
        this.add.text(game.config.width / 2, game.config.height / 2, "Game Over!", {fontSize: "48px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 48, "Your score: " + this.scene.get("PlayGame").score , {fontSize: "30px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 96, "Press SPACE to play again", {fontSize: "30px", fill: "#ffffff"}).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 144, "or ESC to return to menu", {fontSize: "30px", fill: "#ffffff"}).setOrigin(0.5);

        //Create Game Over inputs
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("PlayGame");
        });

        this.input.keyboard.once("keydown-ESC", () => {
            this.scene.start("MainMenu");
        });
    }
}