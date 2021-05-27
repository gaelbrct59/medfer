import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  code: string;
  url: string | ArrayBuffer;
  canvas: HTMLCanvasElement;
  constructor(private route:ActivatedRoute,  public socketService: SocketioService) {
    this.code = "";
    this.url = null;
   }

   ngOnInit(): void {
     
     this.route
     .queryParams
     .subscribe(params => {
       this.code = params['code'];
      })
      this.socketService.setupSocketConnection(this.code);
    }

    ngOnDestroy(): void {
      console.log("destroyed");
      this.socketService.closeSocketConnection();
    }
      
    addMedia(): void{
      document.getElementById('attachment').click();
    }

  fileSelected(e: File[]): void{
    if(e.length >  0){
      var reader = new FileReader();
      reader.readAsDataURL(e[0]);
      reader.onload = (event) => {this.socketService.sendImage(event.target.result);}
    }
  }

  

}
