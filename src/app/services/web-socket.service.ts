import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket: WebSocket;
  
  chatMessages: string[] = [];
  image: string | ArrayBuffer = "";

  constructor() { }

  public openWebSocket(){
  

    this.webSocket = new WebSocket(location.origin.replace(/^http/, 'ws') + ':8080');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      console.log("Receive :" + event.data);
      // this.chatMessages.push(event.data);
      this.image = event.data;    
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(message: string){
    this.chatMessages.push(message);
    this.webSocket.send(message);
  }

  public sendImage(message: string | ArrayBuffer){
    this.image = message;
    this.webSocket.send(message);
  }


  public closeWebSocket() {
    this.webSocket.close();
  }
}