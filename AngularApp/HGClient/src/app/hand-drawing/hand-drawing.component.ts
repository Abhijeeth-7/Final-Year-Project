import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hand-drawing',
  templateUrl: './hand-drawing.component.html',
  styleUrls: ['./hand-drawing.component.css']
})
export class HandDrawingComponent implements OnInit {

  @Input() id!:any;
  @Input() fingers!: Array<boolean>;
  @Input() dir!: string|null;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  ogx!:number;
  ogy!:number;
  timer!: any;
  constructor() { }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.canvas.width = 400;
    this.canvas.height = 500;
    this.ogx = 100;
    this.ogy = 300;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    setInterval(()=>{this.frame()}, 10);
  }

  start(){
  }

  ngOnChanges(): any{
  }

  frame() {
    try{
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if(this.fingers.length == 5){
        if(this.dir == "up"){
          this.ogx = 150;
          if (this.ogy < 50) {
            this.ogy = 350;
          }
          else {
            this.ogy -= 1;
          }
        }
        else if(this.dir == "down"){
          
          this.ogx = 150;
          if (this.ogy > 350) {
            this.ogy = 50;
          }
          else {
            this.ogy += 1;
          }
        }
        else if(this.dir == "right"){
          
          this.ogy = 300;
          if (this.ogx > 350) {
            this.ogx = 50;
          }
          else {
            this.ogx += 1;
          }
        }
        else if(this.dir == "left"){
          
          this.ogy = 300;
          if (this.ogx < 50) {
            this.ogx = 350;
          }
          else {
            this.ogx -= 1;
          }
        }else{
          this.ogx = 150;
          this.ogy = 300;
        }
        this.drawHand(this.ctx, this.ogx,this.ogy);
      }
      else{
        let totalFingers = this.fingers;
        this.fingers = totalFingers.slice(0,5);
        this.drawHand(this.ctx, 200, 150);
        this.fingers = totalFingers.slice(5);
        this.drawHand(this.ctx, 200, 400);
      }
    }
    catch(exception){}
  }

  
  drawHand(ctx: any, x:number, y:number): void{
    let p5,p9,p13,p17,p0,p1;
    p1=[x-50,y+20];
    p5 = [x-50,y-50];
    p9 = [x-20,y-60];
    p13 = [x+10,y-57];
    p17 = [x+40,y-50];
    p0 = [x,y+45];

    //thumb finger points
    let p2,p3,p4;
    if(this.fingers[0]){
      p2=[p1[0]-20,p1[1]-20];
      p3=[p1[0]-40,p1[1]-40];
      p4=[p1[0]-60,p1[1]-60];
    }
    else{
      p2=[p1[0]-20,p1[1]-20];
      p3=[p1[0],p1[1]-40];
      p4=[p1[0]+20,p1[1]-40];

    }

    //index finger points
    let p8,p7,p6;
    if(this.fingers[1]){
      p6=[p5[0]-12,p5[1]-30];
      p7=[p5[0]-20,p5[1]-55];
      p8=[p5[0]-26,p5[1]-75];
    }
    else{
      p6=[p5[0]-5,p5[1]+15];
      p7=[p5[0],p5[1]+30];
      p8=[p5[0]+10,p5[1]+50];
    }
    //middle finger points
    let p12,p10,p11;
    if(this.fingers[2]){
      p10=[p9[0]-5,p9[1]-30];
      p11=[p9[0]-10,p9[1]-55];
      p12=[p9[0]-15,p9[1]-75];

    }
    else{
      p10=[p9[0]-5,p9[1]+15];
      p11=[p9[0]-3,p9[1]+30];
      p12=[p9[0],p9[1]+50];

    }
    
    //ring finger points
    let p14,p15,p16;
    if(this.fingers[3]){
    p14=[p13[0]+1,p13[1]-30];
    p15=[p13[0]+2,p13[1]-55];
    p16=[p13[0]+3,p13[1]-80];
    }
    else{
      p14=[p13[0]-5,p13[1]+15];
      p15=[p13[0]-3,p13[1]+30];
      p16=[p13[0],p13[1]+50];

    }
    //little finger points
    let p18,p19,p20;
    if(this.fingers[4]){
      p18=[p17[0]+5,p17[1]-25];
      p19=[p17[0]+10,p17[1]-45];
      p20=[p17[0]+15,p17[1]-65];
    }
    else{
      p18=[p17[0]-5,p17[1]+15];
      p19=[p17[0]-3,p17[1]+30];
      p20=[p17[0],p17[1]+50];

    }

    //thumb connections
    this.drawLine(p1,p2,ctx);
    this.drawLine(p2,p3,ctx);
    this.drawLine(p3,p4,ctx);
    //index connections
    this.drawLine(p5,p6,ctx);
    this.drawLine(p6,p7,ctx);
    this.drawLine(p7,p8,ctx);
    //middle connections
    this.drawLine(p9,p10,ctx);
    this.drawLine(p10,p11,ctx);
    this.drawLine(p11,p12,ctx);
    //ring connections
    this.drawLine(p13,p14,ctx);
    this.drawLine(p14,p15,ctx);
    this.drawLine(p15,p16,ctx);
    //little connections
    this.drawLine(p17,p18,ctx);
    this.drawLine(p18,p19,ctx);
    this.drawLine(p19,p20,ctx);


    this.drawLine(p5,p9,ctx);
    this.drawLine(p9,p13,ctx);
    this.drawLine(p13,p17,ctx);
    this.drawLine(p17,[x+40,p1[1]],ctx);
    this.drawLine([x+40,p1[1]],p0,ctx);
    this.drawLine(p5,p1,ctx);
    this.drawLine(p0,p1,ctx);

    this.drawCircle([x+40,p1[1]],ctx);
    this.drawCircle(p1,ctx);
    //thumb
    this.drawCircle(p2,ctx);
    this.drawCircle(p3,ctx);
    this.drawCircle(p4,ctx);

    this.drawCircle(p5,ctx);
    //index
    this.drawCircle(p6,ctx);
    this.drawCircle(p7,ctx);
    this.drawCircle(p8,ctx);

    this.drawCircle(p9,ctx);
    //middle
    this.drawCircle(p10,ctx);
    this.drawCircle(p11,ctx);
    this.drawCircle(p12,ctx);

    this.drawCircle(p13,ctx);
    //ring
    this.drawCircle(p14,ctx);
    this.drawCircle(p15,ctx);
    this.drawCircle(p16,ctx);

    this.drawCircle(p17,ctx);
    //little
    this.drawCircle(p18,ctx);
    this.drawCircle(p19,ctx);
    this.drawCircle(p20,ctx);

    this.drawCircle(p0,ctx);

  }


  drawLine(p1: any,p2: any, ctx: CanvasRenderingContext2D){
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  }

  drawCircle(xy: any,ctx: CanvasRenderingContext2D){
    let x = xy[0];
    let y = xy[1];
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.fill();
  }


}
