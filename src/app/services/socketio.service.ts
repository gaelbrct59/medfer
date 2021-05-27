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
  constructor() {
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
        this.canvas = document.getElementsByTagName("canvas")[0] as HTMLCanvasElement;
      }
      this.canvas.style.background='url(' + data + ') no-repeat center center';
    });
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
