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
  contenu_topbar: HTMLElement;
  canvas: HTMLCanvasElement;
  constructor(private route: ActivatedRoute, private router: Router, public socketService: SocketioService) {
    this.code = "";
    this.url = null;
    this.contenu_topbar = document.getElementById("actual-code") as HTMLElement;
    if (SocketioService.socket === undefined){
      this.contenu_topbar.innerText = "";
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  ngOnInit(): void {
    

    this.route
      .queryParams
      .subscribe(params => {
        this.code = params['code'];
      })
    this.contenu_topbar.innerText = this.code;

    this.socketService.setupSocketConnection();
  }

  ngOnDestroy(): void {
    console.log("destroyed");
     if(SocketioService.socket){
      console.log("leave");
      
      SocketioService.socket.emit("leave", this.code);
      this.socketService.closeSocketConnection();
      this.contenu_topbar.innerText = "";
     }
    
  }

  addMedia(): void {
    document.getElementById('attachment').click();
  }

  fileSelected(e: File[]): void {
    if (e.length > 0) {
      var nbSlice = Math.ceil(e[0].size / 300000);
      console.log(e[0].size, nbSlice);
      var readerZ = new FileReader();
      readerZ.readAsDataURL(e[0]);
      readerZ.onload = (event) => {
        for (var i = 1; i <= nbSlice; i++) {
          var base64data = event.target.result.slice((i-1)*400000, i*400000);
          this.socketService.sendImageSlice(nbSlice, i, base64data);
        }
      };
    }
  }



}
