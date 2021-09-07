var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var cactusGroup,cactusImage,cactus;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex.png1.jpg","trex.png2.jpg","trex.png3.jpg");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("background.png.jpg");
  
  cloudImage = loadImage("cloud.png.jpg");
  
  cactus1= loadImage("cactus.png1.jpg");
  cactus2 = loadImage("cactus.png2.jpg");
  cactus3 = loadImage("cactus.png3.jpg");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameover.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  cactusGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawncactus();
    
    if(cactusGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      if(mousePressedOver(restart)) {
        reset();
      }
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     cactusGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  score=0;
  gameState= PLAY;
  trex.changeAnimation("running");
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();

}


function spawncactus(){
 if (frameCount % 60 === 0){
   var cactus = createSprite(600,165,10,40);
   cactus.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cactus.addImage(cactus1);
              break;
      case 2: cactus.addImage(cactus2);
              break;
      case 3: cactus.addImage(cactus3);
              break;
    }
   
    //assign scale and lifetime to the obstacle           
   cactus.scale = 0.5;
    cactus.lifetime = 300;
   
   //add each obstacle to the group
    cactusGroup.add(cactus);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}