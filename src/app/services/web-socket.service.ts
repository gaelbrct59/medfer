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
    // var HOST = location.origin.replace(/^http/, 'ws')
    //this.webSocket = new WebSocket('ws://0.0.0.0:2121');
    // this.webSocket = new WebSocket(HOST);
    
    var protocol;

    if(window.location.protocol === 'https:') {
        protocol = 'wss://';
    } else {
        protocol = 'ws://';
    }

    this.webSocket = new WebSocket(location.origin.replace(/^http/, 'ws') +  ':2121');


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
    console.log("Send : " + message);
    this.image = message;
    this.webSocket.send(message);
  }


  public closeWebSocket() {
    this.webSocket.close();
  }
}