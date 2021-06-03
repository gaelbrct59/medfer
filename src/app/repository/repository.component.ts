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
  constructor(private route: ActivatedRoute, public socketService: SocketioService) {
    this.code = "";
    this.url = null;
    this.contenu_topbar = document.getElementById("actual-code") as HTMLElement;
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
    SocketioService.socket.emit("leave", this.code);
    this.socketService.closeSocketConnection();
    this.contenu_topbar.innerText = "";
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
