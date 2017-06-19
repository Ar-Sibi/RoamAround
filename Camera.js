function Camera(){
  this.x=0;
  this.y=0;

  this.getDistortedPositionX=function(object){
    return object.x-this.x;
  }

  this.getDistortedPositionY=function(object){
    return object.y-this.y;
  }

  this.getPositionfromX=function(x){
    return x-this.x;
  }

  this.getPositionfromY=function(y){
    return y-this.y;
  }

  this.getCameraState=function(){
    this.x=user.x-VISIBLE_W/2;
    this.y=user.y-VISIBLE_H/2;
  }
}
