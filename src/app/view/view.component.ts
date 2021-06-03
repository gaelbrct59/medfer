import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SocketioService } from '../services/socketio.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  password: string;
  existPassword: string;
  code: string;
  nameuser: string;
  constructor(private route:Router) { 
    this.code = "";
    this.password = "";
    this.existPassword = "";
  }

  ngOnInit(): void {
    SocketioService.connectToSocket();
  }

  getCode(){
    
    if(this.code.length > 0 /*&& this.nameuser.length > 0*/){
      SocketioService.socket.emit('code', this.code);
      console.log(SocketioService.socket.id);
      SocketioService.socket.on('response', (isOk) => {
        document.getElementById("modal-code").classList.remove("hidden");
        if (isOk){
          document.getElementById("modal-create-room").classList.remove("hidden");
        }else{
          document.getElementById("modal-enter-code").classList.remove("hidden");
        }

      })
      // this.route.navigate(['/repository'], {queryParams: {code: this.code}});
    }else{
      alert("Remplir");
    }
  }

  getPassword(){
    SocketioService.socket.emit('getpassword', {  code: this.code, 
                                                  pass : this.password});
    document.getElementById("modal-create-room").classList.add("hidden");
    document.getElementById("modal-code").classList.remove("hidden");
    
    this.route.navigate(['/repository'], {queryParams: {code: this.code}});
  }
  
  closeModal(){
    document.getElementById("modal-create-room").classList.add("hidden");
    document.getElementById("modal-enter-code").classList.add("hidden");
    document.getElementById("modal-code").classList.add("hidden");
    this.password = "";
    this.existPassword = "";
    
  }
  
  getExistPassword(){
    console.log("etsets");
    SocketioService.socket.emit('verifypassword', { code: this.code, 
                                                    pass : this.existPassword});
    SocketioService.socket.on('responsepass', (isOk) => {
      if(isOk){
        document.getElementById("modal-enter-code").classList.add("hidden");
        document.getElementById("modal-code").classList.remove("hidden");
        
        this.route.navigate(['/repository'], {queryParams: {code: this.code}});
      }else{
        document.getElementById("modal-enter-code").innerHTML += "Error, bad password";
      }
    })
  }

}
