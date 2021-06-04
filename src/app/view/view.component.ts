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
    document.getElementById("close-modal").addEventListener('click', () => {
      console.log("clicckckkck");
    })
  }

  getCode(){
    
    if(this.code.length > 0 /*&& this.nameuser.length > 0*/){
      this.code = this.code.replace(/ /g,"_");
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
    console.log("get password");
    
    SocketioService.socket.emit('getpassword', {  code: this.code, 
                                                  pass : this.password});
    this.closeModal();
    document.getElementById("modal-code").classList.remove("hidden");
    
    this.route.navigate(['/repository'], {queryParams: {code: this.code}});
  }
  
  closeModal(){
    console.log("close modal");
    
    document.getElementById("modal-create-room").classList.add("hidden");
    document.getElementById("modal-enter-code").classList.add("hidden");
    document.getElementById("modal-code").classList.add("hidden");
    var tmp = document.getElementById("error");
    if(tmp != undefined){
      tmp.remove();
    }
    this.password = "";
    this.existPassword = "";
    
  }
  
  getExistPassword(){
    console.log("get Exist password");
    SocketioService.socket.emit('verifypassword', { code: this.code, 
                                                    pass : this.existPassword});
    SocketioService.socket.on('responsepass', (isOk) => {
      if(isOk){
        
        this.closeModal();
        document.getElementById("modal-code").classList.remove("hidden");
        this.route.navigate(['/repository'], {queryParams: {code: this.code}});
      }else{
        if(document.getElementById("error") == undefined)
        {
          document.getElementById("modal-enter-code").insertAdjacentHTML( 'beforeend', '<div id="error">Error, wrong password</div>');
        }
      }
    })
  }

}
