// Game.ts
import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private animations!: Phaser.Animations.Animation[];
  private object!: Phaser.Physics.Arcade.StaticGroup;




  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', '/assets/house/bg.jpeg');
    this.load.atlas('character', '/assets/character/adam.png', '/assets/character/adam.json');
    this.load.spritesheet('machine', '/assets/house/object/vendingmachine.png',{frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('logo', '/assets/house/object/logo192.png',{frameWidth: 64, frameHeight: 64 });
    this.load.image('speechBubble', '/assets/house/object/speechbubble.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 배경 설정
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0); // 빈공간에 배경 반복

    // 키보드 움직임
    this.cursors = this.input.keyboard.createCursorKeys();

    // 캐릭터 생성
    const character = this.player = this.physics.add.sprite(
      width * 0.5,
      height * 0.5,
      'character',
      'Adam_idle_anim_21.png'
    );
    character.setDepth(1); // 이미지 겹침 우선순위 


    // object 그룹 생성
    this.object = this.physics.add.staticGroup(); 


    // 말풍선 초기 생성
    const speechBubble = this.add.sprite(0, 0, 'speechBubble');
    speechBubble.setVisible(false); // 일단 말풍선을 보이지 않게함
    speechBubble.setScale(90 / speechBubble.width, 90 / speechBubble.height);

    // machine 생성
    const machine = this.object.create(200, 200, 'machine');
    machine.setSize(48,64); // 충돌 영역 설정
    this.physics.add.collider(character, machine, () => {
    if (!character.body.touching.none && !machine.body.touching.none) {
        // character와 machine이 접촉 중인 경우에만 실행
        speechBubble.setPosition(machine.x, machine.y - machine.height);
        speechBubble.setVisible(true); // character와 machine이 충돌할 때 말풍선 표시
        setTimeout(() => {
            speechBubble.setVisible(false);
        }, 4000);
        }
    });



    // chair 생성
    // const logo = this.object.create(300,300,'logo'); 
    // logo.setSize(64,64); // 충돌 영역 설정
    // this.physics.add.collider(character, logo, () => {
    //     speechBubble.setPosition(logo.x, logo.y - logo.height);
    //     speechBubble.setVisible(true); // character와 logo가 충돌할 때 말풍선 표시
    //     setTimeout(() => {
    //         speechBubble.setVisible(false);
    //     }, 4000);
    // });

    // 애니메이션 설정
    this.createAnimations();
    // 캐릭터에 기본 애니메이션 설정
    this.player.anims.play('idle_down', true);
  }

  createAnimations() {
    const frameRate = 10;

    // 아래로 걷는 모션
    this.anims.create({
      key: 'idle_down',
      frames: this.anims.generateFrameNames('character', {
        prefix: 'Adam_idle_anim_',
        start: 19,
        end: 24,
        zeroPad: 0,
        suffix: '.png',
      }),
      frameRate,
      repeat: -1,
    });

    // 왼쪽으로 걷는 모션
    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNames('character', {
        prefix: 'Adam_idle_anim_',
        start: 13,
        end: 18,
        zeroPad: 0,
        suffix: '.png',
      }),
      frameRate,
      repeat: -1,
    });

    // 오른쪽으로 걷는 모션
    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNames('character', {
        prefix: 'Adam_idle_anim_',
        start: 1,
        end: 6,
        zeroPad: 0,
        suffix: '.png',
      }),
      frameRate,
      repeat: -1,
    });
    
    // 위로 걷는 모션
    this.anims.create({
      key: 'idle_up',
      frames: this.anims.generateFrameNames('character', {
        prefix: 'Adam_idle_anim_',
        start: 7,
        end: 12,
        zeroPad: 0,
        suffix: '.png',
      }),
      frameRate,
      repeat: -1,
    });
  }

  update() {
    const speed = 200;
    const player = this.player;

    player.setVelocity(0);

    if (this.cursors.left?.isDown) {
      player.setVelocityX(-speed);
      player.anims.play('idle_left', true);
    } else if (this.cursors.right?.isDown) {
      player.setVelocityX(speed);
      player.anims.play('idle_right', true);
    } else if (this.cursors.up?.isDown) {
      player.setVelocityY(-speed);
      player.anims.play('idle_up', true);
    } else if (this.cursors.down?.isDown) {
      player.setVelocityY(speed);
      player.anims.play('idle_down', true);
    } else {
      // 어떤 키도 눌리지 않은 경우 정지 애니메이션 표시
      player.anims.stop();
      if (player.body.velocity.x < 0) {
        player.setTexture('character', 'Adam_idle_anim_13.png');
      } else if (player.body.velocity.x > 0) {
        player.setTexture('character', 'Adam_idle_anim_7.png');
      } else if (player.body.velocity.y < 0) {
        player.setTexture('character', 'Adam_idle_anim_1.png');
      } else if (player.body.velocity.y > 0) {
        player.setTexture('character', 'Adam_idle_anim_19.png');
      }
    }
  }
}

