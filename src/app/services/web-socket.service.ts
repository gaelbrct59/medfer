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
    this.webSocket = new WebSocket('ws://localhost:2121');

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
    console.log("Send : " + message);
    this.chatMessages.push(message);
    this.webSocket.send(message);
  }

  public sendImage(message: string | ArrayBuffer){
    console.log("Send : " + message);
    this.image = message;
    this.webSocket.send(message);
  }


  public closeWebSocket() {
    this.webSocket.close();
  }
}