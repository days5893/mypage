let bar, //「バー」のスプライト情報
  block, //「ブロック」のスプライト情報
  blockGroup, //「ブロック」のグループ情報
  ball, //「ボール」のスプライト情報
  wallLeft, //「左側の壁」スプライト情報
  wallRight, //「右側の壁」スプライト情報
  wallTop,
  wallBottom,
  missCount,
  gameState; //「上側の壁」スプライト情報
let t_start; //ミスしたときの時間
let t; //ミスから経過した時間
function setup() {
  //canvasの生成
  createCanvas(300, 250);
  missCount = 0;
  //初期画面の設定処理
  gameInit();
}

function draw() {
  t = (millis() - t_start) / 1000;
  //背景色の設定
  gameState
  switch (gameState) {
    case "play":
      background("#3366ff");
      //「ボール」が「バー」に接触した際の角度調整
      if (ball.bounce(bar)) {
        let swing = (ball.position.x - bar.position.x) / 3;
        ball.setSpeed(3, ball.getDirection() + swing);
      }

      //ブロックのグループに当たり判定を設定
      ball.bounce(blockGroup, function (ball, block) {
        block.remove();
      });

      //ボールの画面外の壁に当たり判定を設定
      ball.bounce(wallLeft);
      ball.bounce(wallRight);
      ball.bounce(wallTop);
      bar.bounce(wallLeft);

      //ミスのカウント
      if (ball.bounce(wallBottom)) {
        t_start = millis();
        print((millis() - t_start) / 1000);
        missCount++;
      }

      if (t <= 1.5) {
        noStroke();
        textAlign(CENTER, CENTER);
        text("miss!", width / 2, height * 0.67);
      }

      //ミスを3回したらgamestateをゲームオーバーに設定
      if (missCount == 3) {
        gameState = "gameover";
        fill(255);
        textAlign(CENTER, CENTER);
      }

      //バーが壁に当たったときの跳ね返り
      if (bar.bounce(wallLeft)) {
        bar.setSpeed(1.5, 0);
      } else if (bar.bounce(wallRight)) {
        bar.setSpeed(1.5, 180);
      }

      if (blockGroup.length == 0) {
        gameState = "clear";
      }
      //スプライトの表示
      drawSprites();
      break;

    case "gameover":
      gameOver();
      break;

    case "clear":
      textAlign(CENTER, CENTER);
      text("game clear!", width / 2, height / 2);
      text("nで次のステージへ", width / 2, height / 2+20);
      if(key == "n") setup();
      break;
  }
}

function gameOver() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  text("game over!", width / 2, height / 2);
  //スプライトを全て消す
  allSprites.removeSprites(); //全グループ削除
}

function gameInit() {
  let blockWidth = 40, //ブロックの幅
    blockHeight = 20, //ブロックの高さ
    blockMargin = 4, //ブロックの間隔
    offset = 40; //ブロックのオフセット値
  gameState = "play"; //ゲームをプレイ中にする
  allSprites.removeSprites();
  //画面外の壁を生成
  wallLeft = createSprite(-5, height / 2, 10, height);
  wallLeft.immovable = true;
  wallRight = createSprite(width + 5, height / 2, 10, height);
  wallRight.immovable = true;
  wallTop = createSprite(width / 2, -5, width, 10);
  wallTop.immovable = true;
  wallBottom = createSprite(width / 2, height + 5, width, 10);
  wallBottom.immovable = true;
  //画面中央下段に「バー」を生成
  bar = createSprite(width / 2, height - 20, 80, 10);
  bar.shapeColor = "#ffcc00";
  bar.immovable = true;

  //画面中央に「ボール」を生成
  ball = createSprite(width / 2, height / 2, 8, 8);
  ball.shapeColor = "#ffffff";

  //「ボール」の速度3で、90度下方向へ移動
  ball.setSpeed(3, random(80, 100));

  //グループの生成
  blockGroup = new Group();

  //横に6個縦に2段のブロックを配置
  for (let r = 0; r < 2; r++) {
    //縦のブロック数
    for (let c = 0; c < 6; c++) {
      //横のブロック数

      //X・Y座標は(オフセット値+ブロック数*(ブロック幅/高さ+間隔))
      block = createSprite(
        offset + c * (blockWidth + blockMargin),
        offset + r * (blockHeight + blockMargin),
        blockWidth,
        blockHeight
      );
      block.immovable = true;
      //ブロックを1つずつグループに追加
      blockGroup.add(block);
    }
  }
}

//キー操作の入力受け取り
function keyPressed() {
  //左右矢印キーで移動方向の変更
  switch (keyCode) {
    case RIGHT_ARROW:
      bar.setSpeed(2, 0);
      break;

    case LEFT_ARROW:
      bar.setSpeed(2, 180);
      break;

    case ESCAPE:
      if (gameState == "gameover" || gameState == "clear") {
        setup();
      } 
      break;
  }

  //ブラウザ機能を無効化
  return false;
}
