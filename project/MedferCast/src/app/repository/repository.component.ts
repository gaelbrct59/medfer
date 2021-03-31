import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  code: string;
  url: string | ArrayBuffer;
  constructor(private route:ActivatedRoute) {
    this.code = "";
    this.url = null;
   }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      this.code = params['code'];
    })
  }

  addMedia(): void{
    document.getElementById('attachment').click();
  }

  fileSelected(e: File[]): void{
    if(e.length >  0){
      var reader = new FileReader();
      reader.readAsDataURL(e[0]);
      reader.onload = (_event) => {this.url = _event.target.result;}
    }
  }

}
