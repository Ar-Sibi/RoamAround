function Player(x,y){
  this.x=x;
  this.y=y;
  this.hp=50;
  this.alive=true;
  this.setupPlayer=function(newX,newY){
    this.x=newX;
    this.y=newY;
  };
  this.direction=UP;
  this.bulletpicx=0;
  this.bulletpicy=0;
  this.score=0;
  this.bulletsrc=user_normal_bullet;
  this.hit=function(dmg){
    user_audio.play();
    this.hp-=dmg;
    console.log(this.hp);
    if(this.hp<=0)
      this.alive=false;
  }

  this.moveUp=function(){
    if((this.y-MOVE)>getBound(UP)  && !doesCollide(this.x+X_ADJUSTOR,this.y-MOVE+Y_ADJUSTOR,0,USER))
      this.y=this.y-MOVE;
    tick[UP]++;
  };

  this.moveLeft=function(){
    if((this.x-MOVE)>getBound(LEFT)  && !doesCollide(this.x-MOVE+X_ADJUSTOR,this.y+Y_ADJUSTOR,0,USER))
      this.x=this.x-MOVE;
    tick[LEFT]++;
  };

  this.moveDown=function(){
    if((this.y+MOVE)<getBound(DOWN)  && !doesCollide(this.x+X_ADJUSTOR,this.y+MOVE+Y_ADJUSTOR,0,USER))
      this.y=this.y+MOVE;
    tick[DOWN]++;
  };

  this.moveRight=function(){
    if((this.x+MOVE)<getBound(RIGHT)  && !doesCollide(this.x+MOVE+X_ADJUSTOR,this.y+Y_ADJUSTOR,0,USER))
      this.x=this.x+MOVE;
    tick[RIGHT]++;
  };

  this.fire=function(direction){
    if(tick[FIRE]==0){
      var firedBullet=new Bullet();
      firedBullet.x=user.x;
      firedBullet.y=user.y;
      firedBullet.direction=direction;
      firedBullet.spritesheetsource=user_normal_bullet;
      firedBullet.spritesheetx=user.bulletpicx;
      firedBullet.spritesheety=user.bulletpicy;
      firedBullet.velocity=4;
      firedBullet.x_adjustor=15;
      firedBullet.y_adjustor=15;
      firedBullet.dmg=2;
      firedBullet.firedby=USER;
      bullets.push(firedBullet);
    }
    tick[FIRE]++;
    tick[FIRE]%=30;
  }

  this.attack=function(){
    if(tick[ATTACK]==0){
      doesCollide(this.x+X_ADJUSTOR,Y_ADJUSTOR+this.y,1.5);
      switch(user.direction){
        case UP:  doesCollide(this.x+X_ADJUSTOR,Y_ADJUSTOR+this.y-ATTACK_RANGE,1.5);
          doesCollide(this.x+X_ADJUSTOR,Y_ADJUSTOR+this.y-ATTACK_RANGE,1.5);
          doesCollide(this.x+X_ADJUSTOR-30,Y_ADJUSTOR+this.y-ATTACK_RANGE,1.5);
          sliced_x=this.x;
          sliced_y=this.y-30;
          break;
        case LEFT:   doesCollide(X_ADJUSTOR+this.x-ATTACK_RANGE,Y_ADJUSTOR+this.y,1.5);
          doesCollide(X_ADJUSTOR+this.x-ATTACK_RANGE,Y_ADJUSTOR+this.y-30,1.5);
          doesCollide(X_ADJUSTOR+this.x-ATTACK_RANGE,Y_ADJUSTOR+this.y+30,1.5);
          sliced_x=this.x-30;
          sliced_y=this.y;
          break;
        case DOWN:   doesCollide(X_ADJUSTOR+this.x,Y_ADJUSTOR+this.y+ATTACK_RANGE,1.5);
          doesCollide(X_ADJUSTOR+this.x-30,Y_ADJUSTOR+this.y+ATTACK_RANGE,1.5);
          doesCollide(X_ADJUSTOR+this.x+30,Y_ADJUSTOR+this.y+ATTACK_RANGE,1.5);
          sliced_x=this.x;
          sliced_y=this.y+30;
          break;
        case RIGHT:  doesCollide(X_ADJUSTOR+this.x+ATTACK_RANGE,Y_ADJUSTOR+this.y,1.5);
          doesCollide(X_ADJUSTOR+this.x+ATTACK_RANGE,Y_ADJUSTOR+this.y-30,1.5);
          doesCollide(X_ADJUSTOR+this.x+ATTACK_RANGE,Y_ADJUSTOR+this.y+30,1.5);
          sliced_x=this.x+30;
          sliced_y=this.y;
          break;
      }
    }
    tick[ATTACK]++;
    tick[ATTACK]%=10;
  }

}
