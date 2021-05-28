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
  
  constructor() {
    
  }

  setupSocketConnection(code: String) {
    console.log("Connection on " + environment.SOCKET_ENDPOINT);
    this.socket = io(environment.SOCKET_ENDPOINT);
    
    
    
    this.socket.on('newPos', (e) => {
      console.log(e);
      this.setTransformP(e.pointx, e.pointy, e.scale);
    });
    this.socket.emit('code', code);
    this.socket.on('receiveImage', (data: string) => {
      console.log("Image reçue");
      this.scale = 1;
      this.panning = false;
      this.pointX = 0;
      this.pointY = 0;
      this.start = { x: 0, y: 0 };
      this.image=data;
      this.zoom = document.getElementById("zoom") as HTMLElement;
      this.setTransform();
      
      this.zoom.addEventListener("pointerdown", (e: MouseEvent) => {
        e.preventDefault();
        this.start = { x: e.clientX - this.pointX, y: e.clientY - this.pointY };
        this.panning = true;
        console.log("mousedown");
      });

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
    
    this.socket.emit('change', {  scale: this.scale, 
      pointx: this.pointX, 
      pointy: this.pointY,
      start: this.start });
  }


  closeSocketConnection() {
    this.image = "";
    this.socket.close();
  }

  sendImage(message: string | ArrayBuffer){
    console.log("Send : Image");
    this.socket.emit('image', message);
  }
  
}
