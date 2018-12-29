class Point{
  constructor(inputX, inputY, size){
    this.x = inputX;
    this.y = inputY;
    this.size = size;
    this.g = 0;
    this.h =0;
    this.f =0;
    this.parent;
    this.obs = false;
  }
  calcG(dV){
    this.g = this.parent.g+dV;
  }
  calcF(){
    this.f = this.g + this.h;
  }
  show(clr){
    fill(clr);
    rect(this.x,this.y,this.size,this.size);
  }
}
