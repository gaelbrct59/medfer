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
  
    console.log("begin open web socket");
    this.webSocket = new WebSocket(location.origin.replace(/^http/, 'ws') + ':2121');
    console.log("websocket initialized with : " + location.origin.replace(/^http/, 'ws') + ':2121');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    //console.log("opened ? " + this.webSocket.OPEN)
    console.log("maybe opened lol");

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