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
    // this.contenu_codebar = document.getElementById("actual-code");
    this.contenu_topbar.innerText = this.code;

    this.socketService.setupSocketConnection(this.code);
  }

  ngOnDestroy(): void {
    console.log("destroyed");
    this.socketService.closeSocketConnection();
    this.contenu_topbar.innerText = "";
  }

  addMedia(): void {
    document.getElementById('attachment').click();
  }

  fileSelected(e: File[]): void {
    if (e.length > 0) {
      // var reader = new FileReader();
      // reader.readAsDataURL(e[0]);
      // reader.onload = (event) => { console.log(event.target.result); }
      // reader.onload = (event) => {this.socketService.sendImage(event.target.result);}

      var nbSlice = Math.ceil(e[0].size / 10000);
      console.log(e[0].size, nbSlice);
      var test = "abcdefghijklmnopqrstuvwxyz";
      for(var i = 1; i<=5; i++) {
        console.log(test.slice((i-1)*6, i*6));
      }

      var readerZ = new FileReader();
      readerZ.readAsDataURL(e[0]);
      readerZ.onload = (event) => {
        for (var i = 1; i <= nbSlice; i++) {

          var base64data = event.target.result.slice((i-1)*40000, i*40000);

          this.socketService.sendImageSlice(nbSlice, i, base64data);
        }
      };
    }
  }



}
