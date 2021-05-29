import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  image: string;
  img: HTMLImageElement;
  scale: number; panning: boolean; pointX : number; pointY: number; start: any; zoom: HTMLElement;
  zoomOuter:HTMLElement;
  constructor() {
    
  }

  setupSocketConnection(code: String) {
    console.log("Connection on " + environment.SOCKET_ENDPOINT);
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('code', code);
    
    
    this.socket.on('newPos', (e) => {
      console.log(e);
      var p = this.convertPercentintoPoint(e.percentx, e.percenty);
      this.setTransformP(p.x, p.y, e.scale);
    });
    
    this.socket.on('receiveImage', (data) => {
      console.log("Image reçue");
      this.scale = 1;
      this.panning = false;
      this.pointX = 0;
      this.pointY = 0;
      this.start = { x: 0, y: 0 };
      this.image=data.base64;
      
      this.zoom = document.getElementById("zoom") as HTMLElement;
      this.zoomOuter = document.getElementsByClassName("zoom-outer")[0] as HTMLElement;
      this.putImage(data.width, data.height);
      this.setTransform();
      
      this.zoom.addEventListener("pointerdown", (e: MouseEvent) => {
        e.preventDefault();
        this.start = { x: e.clientX - this.pointX, y: e.clientY - this.pointY };
        this.panning = true;
        console.log("mousedown");
      });
      // this.zoom.addEventListener("touchmove", () => {
      //   this.zoom.dispatchEvent(new Event("mousewheel"));
      // });


      this.zoom.addEventListener("pointerup", () => {
        this.panning = false;
        console.log("mouseup");
        this.sendChange();
      });

      this.zoom.addEventListener("pointermove", (e: MouseEvent) => {
        e.preventDefault();
        if (!this.panning) {
          return;
        }
        this.pointX = (e.clientX - this.start.x);
        this.pointY = (e.clientY - this.start.y);
        this.setTransform();
      });

      this.zoom.addEventListener("mousewheel", (e: WheelEvent) => {
        e.preventDefault();
        var xs = (e.clientX - this.pointX) / this.scale,
        ys = (e.clientY - this.pointY) / this.scale,
        delta = -e.deltaY;
        (delta > 0) ? (this.scale *= 1.05) : (this.scale /= 1.05);
        this.pointX = e.clientX - xs * this.scale;
        this.pointY = e.clientY - ys * this.scale;
        
        this.setTransform();
      })
      
    });
  }

  setTransform(): void{
    this.zoom.style.transform = "translate(" + this.pointX + "px, " + this.pointY + "px) scale(" +
    this.scale + ")";
  }

  setTransformP(pointx, pointy, scale): void{
    this.pointX = pointx;
    this.pointY = pointy;
    this.scale = scale;
    this.zoom.style.transform = "translate(" + pointx + "px, " + pointy + "px) scale(" +
    scale + ")";
  }

  sendChange(): void {
    console.log(this.scale);
    
    console.log(this.pointX, this.pointY);
    var p = this.convertPointintoPercent(this.pointX, this.pointY);
    console.log(p);
    this.socket.emit('change', {  scale: this.scale, 
      percentx: p.x, 
      percenty: p.y,
      pointx: this.pointX, 
      pointy: this.pointY,
      start: this.start });
  }


  convertPercentintoPoint(percentX, percentY) : any{
    var posX = percentX * this.zoomOuter.offsetWidth;
    var posY = percentY * this.zoomOuter.offsetHeight;
    return {x:posX, y:posY};
  }

  convertPointintoPercent(posX, posY) : any{
    var percentX = posX / this.zoomOuter.offsetWidth;
    var percentY = posY /this.zoomOuter.offsetHeight;
    return {x:percentX, y:percentY};
  }

  putImage(percentX, percentY) : any {
    console.log("size ", percentX, percentY);
    var img = document.getElementById("container-media") as HTMLElement;
    img.style.maxWidth = percentX *  100 + "vw";
    img.style.maxHeight = percentY *  100 + "vh";
  }

  closeSocketConnection() {
    this.image = "";
    this.socket.close();
  }

  sendImage(message: string | ArrayBuffer){
    this.zoom = document.getElementById("zoom") as HTMLElement;
    this.zoomOuter = document.getElementsByClassName("zoom-outer")[0] as HTMLElement;
    console.log("Send : Image");
    const img = new Image();
    img.src = message as string;

    img.onload = () => {

        this.socket.emit('image', {width: img.width / this.zoomOuter.offsetWidth,
                              height: img.height / this.zoomOuter.offsetHeight,
                              base64: message });
    }
  }
  
}
