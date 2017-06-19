function Background(){
  this.spritesheetsource;
  this.spritesheetxstart;
  this.spritesheetx;
  this.spriterange;
  this.spritesheety;
  this.setType=function(tile_type){
    this.spritesheetsource=tile_type.spritesheetsource;
    this.spritesheetxstart=tile_type.spritesheetxstart;
    this.spritesheety=tile_type.spritesheety;
    this.spriterange=tile_type.spriterange;
    this.spritesheetx=tile_type.spritesheetxstart+Math.floor(Math.random()*this.spriterange);
  }
}
