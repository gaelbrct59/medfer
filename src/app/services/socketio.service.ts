import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  image: string;
  canvas: HTMLCanvasElement;
  context: any;
  img: any;
  scale: number; currentzoom: number; originx: number; originy: number; mousex: number; mousey: number;
  constructor() {
    this.scale = 1;
    this.currentzoom = 1;
    this.originx = 0;
    this.originy = 0;
    this.mousex = 0;
    this.mousey = 0;
  }

  setupSocketConnection(code: String) {
    console.log("Connection on " + environment.SOCKET_ENDPOINT);
    
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('code', code);
    this.socket.on('receiveImage', (data: string) => {
      console.log("Image reçu");
      // this.image=data;
      // console.log(this.canvas);
      if(this.canvas == null){
        this.initCanvas();
      }

      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.img = new Image();
      // this.img.src = data;
      this.img.src = 'https://www.zupimages.net/up/21/21/1ejn.jpg';

      this.context.drawImage(this.img, 0,  0, this.img.width,    this.img.height,     // source rectangle
        0, 0, this.canvas.width, this.canvas.height); // destination rectangle
      // this.canvas.style.background='url(' + data + ') no-repeat center center';
    });
  }

  initCanvas(): void{
    console.log("salzut");
    
    this.canvas = document.getElementsByTagName("canvas")[0] as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");


    
    // img.src =

    this.canvas.addEventListener("dblclick", (e) => {this.zoom(e);});
  }

  zoom(event): void{
    var zoom = 2;
    this.mousex = event.clientX - this.canvas.offsetLeft;
    this.mousey = event.clientY - this.canvas.offsetTop;
    zoom = 2;
    if (this.currentzoom == 32)
      return;
    this.currentzoom *= zoom;
    this.context.translate(
      this.originx,
      this.originy
    );
    this.context.scale(zoom, zoom);
    this.context.translate(
      -(this.mousex / this.scale + this.originx - this.mousex / (this.scale * zoom)),
      -(this.mousey / this.scale + this.originy - this.mousey / (this.scale * zoom))
    );
    this.originx = (this.mousex / this.scale + this.originx - this.mousex / (this.scale * zoom));
    this.originy = (this.mousey / this.scale + this.originy - this.mousey / (this.scale * zoom));
    this.scale *= zoom;
  }

  closeSocketConnection() {
    this.image = "";
    this.canvas = null;
    this.socket.close();
  }

  sendImage(message: string | ArrayBuffer){
    
    console.log("Send : Image");
    this.socket.emit('image', message);
  }
  
}
