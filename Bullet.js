function Bullet(){
  this.firedby;
  this.x;
  this.y;
  this.direction;
  this.dmg=2;
  this.x_adjustor=0;
  this.y_adjustor=0;
  this.velocity;
  this.maxfiretick=30;
  this.spritesheet=resourceSheet;
  this.spritesheetx;
  this.spritesheety;

  this.collisionDetect=function(x,y,dmg){
    switch(this.firedby){
      case USER:return doesCollide(x,y,this.dmg);
      case ENEMY:return doesCollide(x,y,0)||this.hitsuser();
    }
  }

  this.hitsuser=function(){
    if(Math.pow((this.x+this.x_adjustor)-(user.x+X_ADJUSTOR),2)+Math.pow((this.y+this.y_adjustor)-(user.y+Y_ADJUSTOR),2)<225)
      user.hit(this.dmg);
    else
      return false;
    return true;
  }

  this.outofBounds=function(){
    switch (this.direction) {
      case UP:if(this.y<getBound(UP))
        return true;
        break;
      case DOWN:if(this.y>getBound(DOWN))
        return true;
        break;
      case LEFT:if(this.x<getBound(LEFT))
        return true;
        break;
      case RIGHT:if(this.x>getBound(RIGHT))
        return true;
        break;
    }
    return false;
  }

  this.move=function(){
    switch (this.direction) {
      case UP:this.y=this.y-this.velocity;
        break;
      case LEFT:this.x-=this.velocity;
        break;
      case DOWN:this.y+=this.velocity;
        break;
      case RIGHT:this.x+=this.velocity;
        break;
    }
  }
}
