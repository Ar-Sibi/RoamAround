function Room(){
this.x;
this.y;
this.type=ROOM;
this.hasleft=false;
this.hasright=false;
this.hasdown=false;
this.hasup=false;
this.isVisited=false;
this.isupconnected=false;
this.isdownconnected=false;
this.isleftconnected=false;
this.isrightconnected=false;
this.setType=function(){
  if(this.y!=0&&this.y!=WIDTH-1){
    if(this.x!=0)
      this.hasleft=Math.floor(Math.random()*2)==1?true:false;
    if(this.x!=WIDTH-1)
      this.hasright=Math.floor(Math.random()*2)==1?true:false;
  }
  else {
    this.hasleft=true;
    this.hasright=true;
  }
  if(this.x!=0&&this.x!=WIDTH-1){
    if(this.y!=0)
      this.hasup=Math.floor(Math.random()*2)==1?true:false;
    if(this.y!=WIDTH-1)
      this.hasdown=Math.floor(Math.random()*2)==1?true:false;
  }
  else {
    this.hasup=true;
    this.hasdown=true;
  }
  if(this.hasleft==this.hasright==this.hasdown==this.hasup)
    this.setType();
}
}
