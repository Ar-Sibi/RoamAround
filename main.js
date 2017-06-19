const UP=0;
const LEFT=1;
const DOWN=2;
const RIGHT=3;
const ATTACK=4;
const FIRE=5;
const W=87;
const A=65;
const S=83;
const D=68;
const Q=81;
const I=73;
const J=74;
const K=75;
const L=76;
const P=80;
const F=70;
const MOVE=3;
const X_ADJUSTOR=11;
const Y_ADJUSTOR=25;
const REFRESH_RATE=1000/60;
const MOVEMENT_TICK=3;
const VISIBLE_H=600;
const VISIBLE_W=600;
const MAP_WIDTH=3600;
const MAP_HEIGHT=3600;
const OUT_OF_SIGHT=MAP_HEIGHT+30;
const USER=1;
const ENEMY=2;
const ENEMY_MELEE=1;
const ENEMY_RANGED=2;
const MODE_PATROL=1;
const MODE_ENGAGE=2;
const TILE_WIDTH=30;
const TILE_HEIGHT=30;
var paused=false;
var ATTACK_RANGE=30;
var tiles=[];
const ROOM=1;
const CORRIDOR=2;
const CORRIDOR_WIDTH=4;
const COIN=1;
var WIDTH=MAP_HEIGHT/VISIBLE_H;
var rooms=[];
var corridors=[];
var rooms_no=10;
var enemy_count;
var keymap={};    // Checks whether a key is being pressed or is released
var mapkey_dir={}; // Maps KeyCode to Directions
var tick={};      // Number of frames for which a key is held
var render;       // Holds the setInterval for draw function
var c;            // Context for Canvas
var obs=[];      // Obstructions' x values
var obstacle_block;
var chest_block;
var coins_block;
var health_block;
var potion_block;
var lava_background;
var grass_background;
var sand_background;
var deep_sea_background;
var map_types=[];
var collisionobj={};
var background_array=[];
var direction_storer=[];
var sliced_x,sliced_y;
var exit;
var bullets=[];
var enemies=[];
var number_of_obstacles=(MAP_WIDTH/VISIBLE_W)*(MAP_HEIGHT/VISIBLE_H)*4+Math.floor((MAP_HEIGHT/VISIBLE_H)*(MAP_WIDTH/VISIBLE_H)*6*Math.random());
var user=new Player(Math.floor(Math.random()*MAP_WIDTH),Math.floor(Math.random()*MAP_HEIGHT));
var camera = new Camera();
var gold_pile_img=new Image();
var userImg=new Image();
var backgroundImg=new Image();
var resourceSheet=new Image();
var user_normal_bullet=new Image();
var enemy_bullet=new Image();
var chest_image=new Image();
var coin_music;
var timer;
var background_audio;
var door_audio;
var user_audio;
var map_type;
var cuts=[];
preinitialize();
function preinitialize(){
  var body=document.getElementById('body');
  canvas=document.createElement('canvas');
  c=canvas.getContext('2d');
  c.canvas.width  = window.innerWidth;
  c.canvas.height = window.innerHeight;
  body.append(canvas);
  //Ticks  used rn
  mapkey_dir[W]=UP;
  mapkey_dir[A]=LEFT;
  mapkey_dir[S]=DOWN;
  mapkey_dir[D]=RIGHT;
  tick[UP]=0;
  tick[LEFT]=0;
  tick[DOWN]=0;
  tick[RIGHT]=0;
  tick[ATTACK]=0;
  tick[FIRE]=0;
  for(i=0;i<WIDTH;i++){
    tiles[i]=[];
  }
  cuts[0]=new Image();
  cuts[1]=new Image();
  cuts[2]=new Image();
  cuts[3]=new Image();
  cuts[4]=new Image();
  coin_music=new Audio("coin_music.wav");
  background_audio=new Audio("background.wav");
  door_audio=new Audio("door_2.wav");
  user_audio=new Audio("user_hit.wav");
  userImg.src='MainGuySpriteSheet.png'
  backgroundImg.src="terrain.png";
  resourceSheet.src="resourcesheet.png"
  cuts[0].src="cut0.png";
  cuts[1].src="cut1.png";
  cuts[2].src="cut2.png";
  cuts[3].src="cut3.png";
  cuts[4].src="cut4.png";
  chest_image.src="chest2.png";
  user_normal_bullet.src="user_normal.png";
  enemy_bullet.src="enemy_normal.png";
  gold_pile_img.src="gold_pile.png"
  background_audio.loop=true;
  background_audio.play();
  drawMenu();
}
function initialize(){
  user=new Player(0,0);
  direction_storer=[];
  keymap={};
  //Start Drawing
  render=setInterval(draw,REFRESH_RATE);
  //Get images from source
  obstacle_block=new BlockType(backgroundImg,2,3,1,5000);
  chest_block=new BlockType(chest_image,0,0,50,1);
  coins_block=new BlockType(gold_pile_img,0,0,50,1);
  potion_block=new BlockType(resourceSheet,34,24,0,1);
  moon_background=new TileType(resourceSheet,53,6,13);
  map_types.push(moon_background);
  lava_background=new TileType(resourceSheet,7,7,13);
  map_types.push(lava_background);
  sand_background=new TileType(resourceSheet,14,7,13);
  map_types.push(sand_background);
  grass_background=new TileType(resourceSheet,0,7,13);
  map_types.push(grass_background);
  user.hp=50;
  user.alive=true;
  user.score=0;
  initializeMapType();
  //Initialize obstacles
  createRooms();
  initializeObstacles();
  //InitializesEnemies
  initializeEnemies();

  //Initialize background
  initializeBackground();
  //Initialize key Inputs
  window.onkeydown=function(e){
    keyDownListener(e.keyCode);
  }
  window.onkeyup=function(e){
    keyUpListener(e.keyCode);
  }
}


function drawMenu(){
  // Fill the path
  c.fillStyle = "#0000000";
  c.fillRect(0,0,600,600);
  c.fillStyle="#00FF00"
  c.font="30px Verdana";
  c.fillText("WASD to move IJKL to fire Q for melee",0,60);
  c.fillText("P to pause ",0,120);
  c.fillText("Press any key to begin",0,180);
  window.onkeydown=function(){

    initialize();
  }
}


function initializeMapType(){
  var pos=Math.floor(Math.random()*map_types.length);
  map_type=map_types[pos];
  map_types.splice(pos,1);
  timer=1200;
}

function initializeEnemies(){
    var x,y;
    enemies=[];
    enemy_count=Math.floor(3*MAP_WIDTH*MAP_HEIGHT/(VISIBLE_H*VISIBLE_W));
    for(i=0;i<enemy_count;i++){
      var enemy=new Enemy();
      do{
        x=Math.floor(Math.random()*(MAP_WIDTH-TILE_WIDTH));
        y=Math.floor(Math.random()*(MAP_HEIGHT-TILE_HEIGHT));
      }while(doesCollide(x+enemy.x_adjustor,y+enemy.y_adjustor,0)||doesCollide(x-enemy.x_adjustor,y-enemy.y_adjustor,0))
      i--;
      if(tiles[Math.floor(x/VISIBLE_W)][Math.floor(y/VISIBLE_W)]==null)
        continue;
      i++;
      enemy.x=x;
      enemy.y=y;
      enemy.initialpositionx=x;
      enemy.initialpositiony=y;
      enemies.push(enemy);
    }
}


function initializeObstacles(){
  obs=[];
  collisionobj={};
  for(var i=0;i<MAP_WIDTH;i++){
    collisionobj[i]={};
    for(var j=0;j<MAP_WIDTH;j++)
      collisionobj[i][j]=null;
  }
  for(i=0;i<WIDTH;i++){
    for(j=0;j<WIDTH;j++){
      if(tiles[i][j]!=null){
        if(tiles[i][j].type==ROOM)
          drawRoom(tiles[i][j]);
        else
            drawCorridor(tiles[i][j]);
      }
    }
  }
  for(var i=0;i<WIDTH;i++);
  for(i=0;i<number_of_obstacles;i++){
    var x=Math.floor(Math.random()*(MAP_WIDTH/TILE_WIDTH));
    var y=Math.floor(Math.random()*(MAP_HEIGHT/TILE_HEIGHT));
    if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)]!=null){
      if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)].type!=ROOM)
        continue;
      }
    else {
      continue;
    }
    if(collisionobj[x]==null)
    {
      collisionobj[x]={};
      i--;
    }
    if(collisionobj[x][y]==null){
      collisionobj[x][y]=new Block(x,y);
      collisionobj[x][y].block_no=obs.length;
      if(Math.random()*100>=10)
        collisionobj[x][y].setBlocktype(obstacle_block);
      else
        collisionobj[x][y].setBlocktype(chest_block);
      obs.push(collisionobj[x][y]);

    }
    else {
      i--;
    }
    var i;
  }

  var x=Math.floor(Math.random()*(MAP_WIDTH/TILE_WIDTH));
  var y=Math.floor(Math.random()*(MAP_HEIGHT/TILE_HEIGHT));
  var isroom=true;
    while(collisionobj[x][y]!=null||isroom){
      isroom=true;
      var x=Math.floor(Math.random()*(MAP_WIDTH/TILE_WIDTH));
      var y=Math.floor(Math.random()*(MAP_HEIGHT/TILE_HEIGHT));
      if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)]!=null){
        if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)].type==ROOM)
          isroom=false;
      }
    }
  exit=new Block(x,y);
  collisionobj[x][y]=exit;
  while(collisionobj[x][y]!=null||isroom){
    isroom=true;
    var x=Math.floor(Math.random()*(MAP_WIDTH/TILE_WIDTH));
    var y=Math.floor(Math.random()*(MAP_HEIGHT/TILE_HEIGHT));
    if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)]!=null){
      if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)].type==ROOM)
        isroom=false;
    }
  }
  user.x=x*30;
  user.y=y*30;
  console.log(exit.x*30+"    "+exit.y*30);
}

function initializeUser(){
  while(true){
    while(collisionobj[x][y]!=null){
      var x=Math.floor(Math.random()*(MAP_WIDTH/TILE_WIDTH));
      var y=Math.floor(Math.random()*(MAP_HEIGHT/TILE_HEIGHT));
    }
    if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)]!=null){
      if(tiles[Math.floor(x*30/VISIBLE_W)][Math.floor(y*30/VISIBLE_W)].type!=ROOM)
        continue;
      else
        break;
      }
      else {
        continue;
  }
  user.x=x*30;
  user.y=y*30;
  user.alive=true;
  }
}

function draw(){
  c.fillStyle="#000000";
  c.fillRect(0,0,601,601);
  camera.getCameraState();
  drawBackground(c);
  drawObstacles(c);
  drawBullets();
  drawEnemies();
  if(user.alive==true)
    drawCharacter(c);
  else
    drawGameOver();
  smoothenTransition();
  drawMap();
  drawBars();
}


function drawBars(){
  if(timer<=0)
    gameOver();
  drawHealthBar();
  c.fillStyle="#00FF00"
  c.font="30px Verdana";
  c.globalAlpha=1;
  c.fillText(user.score,500,30);
  }


function drawHealthBar(){
  c.save();
  c.beginPath();
  c.fillStyle="#FF0000";
  c.fillRect(30,VISIBLE_H+30,50*10,20);
  c.fillStyle="#00FF00";
  c.fillRect(30,VISIBLE_H+30,user.hp*10,20);
  c.fillStyle="#0000FF";
  c.fillRect(630,0,10,timer/2);
  timer-=1/9;
  //c.restore();
}

function drawBackground(c){
  var xupperlimit=user.x+330>MAP_WIDTH?MAP_WIDTH:user.x+330;
  var yupperlimit=user.y+330>MAP_HEIGHT?MAP_HEIGHT:user.y+330;
  for(i=Math.floor(user.x-330<0?0:(user.x-330)/TILE_HEIGHT);i<xupperlimit/30;i++)
    for(j=0;j<MAP_HEIGHT/30;j++){
      if(Math.abs(user.x-i*TILE_WIDTH)<=330&&Math.abs(user.y-j*TILE_HEIGHT)<=330){

        c.drawImage(resourceSheet,32*background_array[i][j].spritesheetx,32*background_array[i][j].spritesheety,32,32,camera.getPositionfromX(i*30),camera.getPositionfromY(j*30),30,30);

      }
    }
}


function drawObstacles(c){
  for(i=0;i<obs.length;i++)  {
    if(Math.abs(user.x-obs[i].x*30)<=330&&Math.abs(user.y-obs[i].y*30)<=330&&obs[i].x*30!=OUT_OF_SIGHT)
      c.drawImage(obs[i].spritesheetsource,32*obs[i].spritesheetx,32*obs[i].spritesheety,32,32,camera.getPositionfromX(obs[i].x*30),camera.getPositionfromY(obs[i].y*30),TILE_WIDTH,TILE_HEIGHT);
  }
    if(Math.abs(user.x-exit.x*30)<=330&&Math.abs(user.y-exit.y*30)<=330)
      c.globalAlpha=1;
      c.drawImage(resourceSheet,32*23,32*11,32,32,camera.getPositionfromX(exit.x*TILE_WIDTH),camera.getPositionfromY(exit.y*TILE_HEIGHT),TILE_WIDTH,TILE_HEIGHT);
}


function userInput(){
  if(keymap[W]==true)
  user.moveUp();
  if(keymap[A]==true)
  user.moveLeft();
  if(keymap[S]==true)
  user.moveDown();
  if(keymap[D]==true)
  user.moveRight();
  if(keymap[I]==true)
    user.fire(UP);
  else if(keymap[J]==true)
    user.fire(LEFT);
  else if(keymap[K]==true)
    user.fire(DOWN);
  else if(keymap[L]==true)
    user.fire(RIGHT);

  else if(tick[FIRE]!=0)
    tick[FIRE]=(tick[FIRE]+1)%30;
  if(keymap[Q]==true)
    user.attack();
  else if(tick[ATTACK]!=0)
    tick[ATTACK]=(tick[ATTACK]+1)%10;
  if(tick[ATTACK]!=0)
      drawAttackAnimation();
}


function drawAttackAnimation(){
  c.drawImage(cuts[Math.floor(tick[ATTACK]/2)],0,0,cuts[0].width,cuts[0].height,camera.getPositionfromX(sliced_x)-30,camera.getPositionfromY(sliced_y),60,60);
}


function drawCharacter(c){
  userInput();
  tiles[Math.floor(user.x/VISIBLE_H)][Math.floor(user.y/VISIBLE_H)].isVisited=true;
  var directionalspriteindex=(user.direction+2)%4;
  var spriteprogress = (Math.floor(tick[user.direction]/10)%3)*45;
  c.drawImage(userImg,spriteprogress,directionalspriteindex*36,45,36,camera.getDistortedPositionX(user),camera.getDistortedPositionY(user),30,30);
}


function smoothenTransition(){
  c.clearRect(VISIBLE_H,0,VISIBLE_H+TILE_HEIGHT,VISIBLE_W+TILE_HEIGHT);
  c.clearRect(0,VISIBLE_W,VISIBLE_H+TILE_HEIGHT,VISIBLE_W+TILE_WIDTH);
  c.clearRect(VISIBLE_H+TILE_HEIGHT,VISIBLE_W+TILE_WIDTH,VISIBLE_H+60,VISIBLE_W+60);
}


function doesCollide(x,y,z,hitby){
  var x=Math.floor((x)/30);
  var y=Math.floor((y)/30);
  //Collision With Blocks
  if(collisionobj[x]!=null)
    if(collisionobj[x][y]!=null){
      if(collisionobj[x][y]==exit&&z==0&&hitby!=null){
        exitHit();
        return;
      }
      if(z!=0&&collisionobj[x][y]!=exit){
        collisionobj[x][y].hit(z);
        if(collisionobj[x][y].hp==0){
          user.score+=collisionobj[x][y].score;
          console.log(user.score);
          if(collisionobj[x][y].type==coins_block)
            coin_music.play();
          if(collisionobj[x][y].type==potion_block)
              user.hp+=6;
          if(collisionobj[x][y].type!=chest_block){
            obs[collisionobj[x][y].block_no].x=OUT_OF_SIGHT/30;
            collisionobj[x][y]=null;
          }
          else  {
            if(Math.random()*4<1)
              collisionobj[x][y].setBlocktype(potion_block);// change dis
            else{
              obs[collisionobj[x][y].block_no].x=OUT_OF_SIGHT/30;
              collisionobj[x][y]=null;
            }
            user_audio.play();
          }
        }
      }
      return true;
    }
    //Collision with enemies
    if(z!=0)
    for(i=0;i<enemies.length;i++)
      if(getBlock(enemies[i].x+enemies[i].x_adjustor)==x&&getBlock(enemies[i].y+enemies[i].y_adjustor)==y){
        enemies[i].hit(z);
        return true;
      }
  return false;
}


function exitHit(){
  if(map_types.length!=0){
    door_audio.play();
    user.score+=500;
    initializeMapType();
    createRooms();
    initializeObstacles();
    initializeBackground();
    initializeEnemies();
  }
  else{
    gameOver();
  }
}
function gameOver(){
  clearInterval(render);
  window.onkeydown=null;
  window.onkeyup=null;
  drawGameOver();

}

function getBound(dir){
  //Currently hard coded replace when different layouts are added
  switch (dir) {
    case UP: return 0;
    case LEFT:return 0;
    case DOWN:return MAP_HEIGHT-30;
    case RIGHT:return MAP_HEIGHT-25;
  }
}




function drawBullets(){
  for(iter=0;iter<bullets.length;iter++){
    if(bullets[iter].collisionDetect(bullets[iter].x+bullets[iter].x_adjustor,bullets[iter].y+bullets[iter].y_adjustor,bullets[iter].dmg)||bullets[iter].outofBounds()){
      bullets.splice(iter,1);
    }
  }

  for(i=0;i<bullets.length;i++){
    if(Math.abs(bullets[i].x-user.x)<=330&&Math.abs(bullets[i].y-user.y)<=330)
    c.drawImage(bullets[i].spritesheetsource,bullets[i].spritesheetx,bullets[i].spritesheety,32,32,camera.getPositionfromX(bullets[i].x),camera.getPositionfromY(bullets[i].y),30,30);
    bullets[i].move();
  }
}


function getBlock(x){
  return Math.floor(x/30);
}


function initializeBackground(){
  background_array=[];
  for(i=0;i<MAP_HEIGHT/30;i++){
     background_array[i]=[];
     for(j=0;j<MAP_WIDTH/30;j++){
       background_array[i][j]=new Background();
       background_array[i][j].setType(map_type);
     }
  }
}


function generateCorners(){
  var cornerroom=new Room();
  cornerroom.x=0;
  cornerroom.y=0;
  cornerroom.hasright=true;
  cornerroom.hasdown=true;
  rooms.push(cornerroom);
  tiles[0][0]=cornerroom;
  var cornerroom=new Room();
  cornerroom.x=0;
  cornerroom.y=WIDTH-1;
  cornerroom.hasright=true;
  cornerroom.hasup=true;
  rooms.push(cornerroom);
  tiles[0][WIDTH-1]=cornerroom;
  var cornerroom=new Room();
  cornerroom.x=WIDTH-1;
  cornerroom.y=0;
  cornerroom.hasleft=true;
  cornerroom.hasdown=true;
  rooms.push(cornerroom);
  tiles[WIDTH-1][0]=cornerroom;
  var cornerroom=new Room();
  cornerroom.x=WIDTH-1;
  cornerroom.y=WIDTH-1;
  cornerroom.hasleft=true;
  cornerroom.hasup=true;
  rooms.push(cornerroom);
  tiles[WIDTH-1][WIDTH-1]=cornerroom;
}

function drawEnemies(){
  var i;

  //Draws Enemies after checking if they need to be drawn
  for(i=0;i<enemies.length;i++)
    if(enemies[i].hp<=0){
      createBlock(getBlock(enemies[i].x+enemies[i].x_adjustor),getBlock(enemies[i].y+enemies[i].y_adjustor),COIN);
      enemies.splice(i,1);
      }
  for(i=0;i<enemies.length;i++){
    if(Math.abs(user.x-enemies[i].x)<330&&Math.abs(user.y-enemies[i].y)<330)
    c.drawImage(enemies[i].spritesheetsource,32*enemies[i].spritesheetx,32*enemies[i].spritesheety,32,32,camera.getPositionfromX(enemies[i].x),camera.getPositionfromY(enemies[i].y),30,30);
    enemies[i].move();

  }
}


function drawMap(){
  for(i=0;i<WIDTH;i++){
    for(j=0;j<WIDTH;j++){
      if(tiles[i][j]!=null){
        if(tiles[i][j].isVisited==true){
          if(tiles[i][j].type==ROOM){
            c.beginPath();
            c.strokeStyle="#FF0000"
            c.rect(660+i*30,j*30,30,30);
            c.stroke();
            c.strokeStyle="#000000"
          }
          c.beginPath();
          if(tiles[i][j].hasleft)
            c.rect(660+i*30,0+j*30+10,15,10);
          if(tiles[i][j].hasright)
            c.rect(660+i*30+15,0+j*30+10,15,10);
          if(tiles[i][j].hasup)
            c.rect(660+i*30+10,j*30,10,15);
          if(tiles[i][j].hasdown)
            c.rect(660+i*30+10,j*30+15,10,15);
          c.stroke();
        }
      }
    }
  }
}

function drawRight(x,y){
  var x_p=x;
  var y_p=y;
  if(x_p<WIDTH)
  while(tiles[x_p][y_p]==null){
    var corridor=new Room();
    corridor.type=CORRIDOR;
    corridor.x=x_p;
    corridor.y=y_p;
    corridor.hasleft=true;
    corridor.hasright=true;
    tiles[x_p][y_p]=corridor;
    corridors.push(corridor);
    x_p++;
    if(x_p>=WIDTH)
      break;
  }
  if(x_p<WIDTH)
      tiles[x_p][y_p].hasleft=true;
}
function drawLeft(x,y){
  var x_p=x;
  var y_p=y;
  if(x>=0)
  while(tiles[x_p][y_p]==null){
    var corridor=new Room();
    corridor.type=CORRIDOR;
    corridor.x=x_p;
    corridor.y=y_p;
    if(x_p>0)
    corridor.hasleft=true;
    corridor.hasright=true;
    tiles[x_p][y_p]=corridor;
    corridors.push(corridor);
    x_p--;
    if(x_p<0)
    break;
  }
  if(x_p>=0)
      tiles[x_p][y_p].hasright=true;
}
function drawUp(x,y){
  var x_p=x;
  var y_p=y;
  if(y_p>=0)
  while(tiles[x_p][y_p]==null){
    var corridor=new Room();
    corridor.type=CORRIDOR;
    corridor.x=x_p;
    corridor.y=y_p;
    if(y_p>0)
    corridor.hasup=true;
    corridor.hasdown=true;
    tiles[x_p][y_p]=corridor;
    corridors.push(corridor);
    y_p--;
    if(y_p<0)
      break;
  }
  if(y_p>=0)
      tiles[x_p][y_p].hasdown=true;
}
function drawDown(x,y){
  var x_p=x;
  var y_p=y;
  if(y_p<WIDTH)
  while(tiles[x_p][y_p]==null){
    var corridor=new Room();
    corridor.type=CORRIDOR;
    corridor.x=x_p;
    corridor.y=y_p;
    corridor.hasup=true;
    if(y_p<WIDTH-1)
    corridor.hasdown=true;
    tiles[x_p][y_p]=corridor;
    corridors.push(corridor);
    y_p++;
    if(y_p>=WIDTH)
      break;
  }
  if(y_p<WIDTH)
      tiles[x_p][y_p].hasup=true;
}
function createRooms(){
  tiles=[];
  rooms=[];
  for(i=0;i<WIDTH;i++){
    tiles[i]=[];
    for(j=0;j<WIDTH;j++)
      tiles[i][j]=null;
  }
  generateCorners();
  for(i=0;i<rooms_no;i++){
    var x=Math.floor(Math.random()*WIDTH);
    var y=Math.floor(Math.random()*WIDTH);
    if(tiles[x][y]==null){
      var generated_room = new Room();
      generated_room.x=x;
      generated_room.y=y;
      generated_room.setType();
      rooms.push(generated_room);
      tiles[x][y]=generated_room;
    }
    else {
    i--;
    }
  }
  createCorridors();
}
function createCorridors(){
  for(i=0;i<rooms.length;i++){
      if(rooms[i].hasright)
        drawRight(rooms[i].x+1,rooms[i].y);
      if(rooms[i].hasup)
        drawUp(rooms[i].x,rooms[i].y-1);
      if(rooms[i].hasleft)
        drawLeft(rooms[i].x-1,rooms[i].y);
      if(rooms[i].hasdown)
        drawDown(rooms[i].x,rooms[i].y+1);
  }
}
function drawCorridor(corridor){
  /*
  Why 10 & 9 alternatively for drawing corridors
  It's because 20 doesnt have one middle element
  the 10th and 9th element are the middle elements so to get a width of 6
  you need to draw from 9-3 to 10+3


  */
  if(corridor.hasup==true)
    for(var i=0;i<(VISIBLE_H/2)/TILE_WIDTH-CORRIDOR_WIDTH/2;i++){
    createBlock(corridor.x*20+9-CORRIDOR_WIDTH/2,corridor.y*20+i);
    createBlock(corridor.x*20+10+CORRIDOR_WIDTH/2,corridor.y*20+i);
    }
  else{
    for(var i=9-CORRIDOR_WIDTH/2;i<=10+CORRIDOR_WIDTH/2;i++)
      createBlock(corridor.x*20+i,corridor.y*20+9-CORRIDOR_WIDTH/2);
  }
  if(corridor.hasdown==true)
    for(var i=10+CORRIDOR_WIDTH/2;i<20;i++){
    createBlock(corridor.x*20+9-CORRIDOR_WIDTH/2,corridor.y*20+i);
    createBlock(corridor.x*20+10+CORRIDOR_WIDTH/2,corridor.y*20+i);
    }
  else{
    for(var i=9-CORRIDOR_WIDTH/2;i<=10+CORRIDOR_WIDTH/2;i++)
      createBlock(corridor.x*20+i,corridor.y*20+10+CORRIDOR_WIDTH/2);
  }
  if(corridor.hasright==true)
    for(var i=10+CORRIDOR_WIDTH/2;i<20;i++){
    createBlock(corridor.x*20+i,corridor.y*20+9-CORRIDOR_WIDTH/2);
    createBlock(corridor.x*20+i,corridor.y*20+10+CORRIDOR_WIDTH/2);
    }
  else{
    for(var i=9-CORRIDOR_WIDTH/2;i<=10+CORRIDOR_WIDTH/2;i++)
      createBlock(corridor.x*20+10+CORRIDOR_WIDTH/2,corridor.y*20+i);
  }
  if(corridor.hasleft==true)
    for(var i=0;i<(VISIBLE_H/2)/TILE_WIDTH-CORRIDOR_WIDTH/2;i++){
    createBlock(corridor.x*20+i,corridor.y*20+9-CORRIDOR_WIDTH/2);
    createBlock(corridor.x*20+i,corridor.y*20+10+CORRIDOR_WIDTH/2);
    }
  else{
    for(var i=9-CORRIDOR_WIDTH/2;i<=10+CORRIDOR_WIDTH/2;i++)
      createBlock(corridor.x*20+9-CORRIDOR_WIDTH/2,corridor.y*20+i);
  }
}

function drawRoom(room){
  for(var i=0;i<VISIBLE_H/TILE_WIDTH;i++){
    if(room.hasup==true&&i==9-CORRIDOR_WIDTH/2+1)
      i+=CORRIDOR_WIDTH;
    createBlock(room.x*20+i,room.y*20);
    }
  for(var i=0;i<VISIBLE_H/TILE_WIDTH;i++){
    if(room.hasdown==true&&i==9-CORRIDOR_WIDTH/2+1)
      i+=CORRIDOR_WIDTH;
    createBlock(room.x*20+i,(room.y+1)*20-1);
  }
  for(var i=0;i<VISIBLE_H/TILE_WIDTH;i++){
    if(room.hasleft==true&&i==9-CORRIDOR_WIDTH/2+1)
      i+=CORRIDOR_WIDTH;
    createBlock(room.x*20,room.y*20+i);
  }
  for(var i=0;i<VISIBLE_H/TILE_WIDTH;i++){
    if(room.hasright==true&&i==9-CORRIDOR_WIDTH/2+1)
      i+=CORRIDOR_WIDTH;
    createBlock((room.x+1)*20-1,(room.y)*20+i);
  }
}
function createBlock(x,y,type){
  collisionobj[x][y]=new Block(x,y);
  collisionobj[x][y].block_no=obs.length;
  if(type==COIN)
    collisionobj[x][y].setBlocktype(coins_block);
  else
    collisionobj[x][y].setBlocktype(obstacle_block);
  obs.push(collisionobj[x][y]);
}
function keyDownListener(code){
  //map key dir matches appropriate keycode with direction
  if(code==P){
    pause();
  }
  if((keymap[code]==false||keymap[code]==null)&&mapkey_dir[code]<4){
    direction_storer.push(mapkey_dir[code]);
    user.direction=mapkey_dir[code];
  }
  keymap[code]=true;
}
function play(){
  if(paused){
  render=setInterval(draw,REFRESH_RATE);
  background_audio.play();
  paused=false;
}
}

function pause(){
  if(paused==false){
    clearInterval(render);
    background_audio.pause();
    paused=true;
  }
  else {
  play();
  }
}

function keyUpListener(code){
  var i;
  for(i=0;i<direction_storer.length;i++)
  if(direction_storer[i]==mapkey_dir[code])
  break;
  direction_storer.splice(i,1);
  if(mapkey_dir[code]==user.direction&&direction_storer.length>0){
    user.direction=direction_storer[0];
  }
  keymap[code]=false;
  tick[code]=0;
}

function drawGameOver(){
  c.fillStyle="#000000";
  c.globalAlpha = 0.6;
  c.fillRect(150,150,300,300);
  c.globalAlpha = 1;
  c.fillStyle="#FF0000";
  c.fillText("You died",240,200);
  c.fillText("Press R to restart",170,310);
  c.fillText("Your score is "+user.score,160,420);
  window.onkeydown=function(e){
    if(e.keyCode==Q+1){
      clearInterval(render);
      initialize();
    }
  }
}
