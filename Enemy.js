function Enemy(x,y){
  this.initialpositionx=x;
  this.initialpositiony=y;
  this.sliced_x;
  this.spritesheetsource=resourceSheet;
  this.spritesheetx=3;
  this.spritesheety=42;
  this.sliced_y;
  this.meleetick=1;
  this.x=x;
  this.y=y;
  this.hp=8;
  this.velocity=1.2;
  this.x_adjustor=15;
  this.y_adjustor=15;
  this.patrolrange=200;
  this.firetick=0;
  this.mode=MODE_PATROL;
  this.direction=Math.floor(Math.random()*4);
  this.bulletpicx=0;
  this.bulletpicy=0;
  this.bulletsrc=enemy_bullet;

  this.move=function () {
    if(this.mode!=MODE_ENGAGE)
      switch (this.direction) {
        case UP:this.moveUp();
          break;
        case LEFT:this.moveLeft();
          break;
        case RIGHT:this.moveRight();
          break;
        case DOWN:this.moveDown();
          break;
    }
    else{
      this.patrolModeMotion();
    }
    this.modeCheck();
  }

  this.modeCheck=function(){
    if((Math.abs(this.x-user.x)+Math.abs(this.y-user.y))<200&&user.alive==true){
      this.mode=MODE_ENGAGE;
    }
    else
      this.mode=MODE_PATROL;
  }

  this.hit=function (dmg) {
    this.hp-=dmg;
  }

  this.patrolModeMotion=function(){

    if(this.x+this.x_adjustor-(user.x+X_ADJUSTOR)>10)
      this.moveLeft();
    if(this.y+this.y_adjustor-(user.y+Y_ADJUSTOR)>10)
      this.moveUp();
    if((user.x+X_ADJUSTOR)-(this.x+this.x_adjustor)>10)
      this.moveRight();
    if(user.y+Y_ADJUSTOR-(this.y+this.y_adjustor)>10)
      this.moveDown();
    if(Math.abs(user.y+Y_ADJUSTOR-(this.y+this.y_adjustor))<=10){
      if(user.x+X_ADJUSTOR>=this.x+this.x_adjustor)
        this.direction=RIGHT;
      else
        this.direction=LEFT;
        this.fire();
    }
    if(Math.abs(user.x+X_ADJUSTOR-(this.x+this.x_adjustor))<=15){
      if(user.y+Y_ADJUSTOR>this.y+this.y_adjustor)
        this.direction=DOWN;
      else
        this.direction=UP;
      this.fire();
    }
  }

  this.moveUp=function(){
    if((this.y-this.velocity)>getBound(UP)  && !doesCollide(this.x+this.x_adjustor,this.y-this.velocity+this.y_adjustor,0)&&(-this.y+this.initialpositiony)<=this.patrolrange)
      this.y=this.y-this.velocity;
    else
      this.direction=DOWN;
  };

  this.moveLeft=function(){
    if((this.x-this.velocity)>getBound(LEFT)  && !doesCollide(this.x-this.velocity+this.x_adjustor,this.y+this.y_adjustor,0)&&(-this.x+this.initialpositionx)<=this.patrolrange)
      this.x=this.x-this.velocity;
    else
      this.direction=RIGHT;
  };

  this.moveDown=function(){
    if((this.y+this.velocity)<getBound(DOWN)  && !doesCollide(this.x+this.x_adjustor,this.y+this.velocity+this.y_adjustor,0)&&(this.y-this.initialpositiony)<=this.patrolrange)
      this.y=this.y+this.velocity;
    else
      this.direction=UP;
  };

  this.moveRight=function(){
    if((this.x+this.velocity)<getBound(RIGHT)  && !doesCollide(this.x+this.velocity+this.x_adjustor,this.y+this.y_adjustor,0)&&(this.x-this.initialpositionx)<this.patrolrange)
      this.x=this.x+this.velocity;
    else
      this.direction=LEFT;
  };

  this.fire=function(){
    //Fires bullets after 60 attempts to fire
    if(this.firetick==0){
      var firedBullet=new Bullet();
      firedBullet.x=this.x;
      firedBullet.y=this.y;
      firedBullet.direction=this.direction;
      firedBullet.spritesheetsource=enemy_bullet;
      firedBullet.spritesheetx=this.bulletpicx;
      firedBullet.spritesheety=this.bulletpicy;
      firedBullet.velocity=5;
      firedBullet.x_adjustor=15;
      firedBullet.y_adjustor=15;
      firedBullet.dmg=2;
      firedBullet.firedby=ENEMY;
      bullets.push(firedBullet);
    }
    this.firetick++;
    this.firetick%=60;
  }

  this.attack=function(){
    //Hasnt been implemented in gameplay and possibly wont be to keep the difficulty fair
    if(meleetick==0){
      switch(this.direction){
        case UP:
          doesCollide(this.x+X_ADJUSTOR,Y_ADJUSTOR+this.y-ATTACK_RANGE,5);
          this.sliced_x=this.x;
          this.sliced_y=this.y-30;
          break;

        case LEFT:
          doesCollide(X_ADJUSTOR+this.x-ATTACK_RANGE,Y_ADJUSTOR+this.y,5);
          this.sliced_x=this.x-30;
          this.sliced_y=this.y;
          break;

        case DOWN:
          doesCollide(X_ADJUSTOR+this.x,Y_ADJUSTOR+this.y+ATTACK_RANGE,5);
          this.sliced_x=this.x;
          this.sliced_y=this.y+30;
          break;

        case RIGHT:  doesCollide(X_ADJUSTOR+this.x+ATTACK_RANGE,Y_ADJUSTOR+this.y,5);
          this.sliced_x=this.x+30;
          this.sliced_y=this.y;
          break;

      }
    }
    this.meleetick++;
    this.meleetick%=10;
  }
}
