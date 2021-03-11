import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  
  code: string;
  constructor() { 
    this.code = ""
  }

  ngOnInit(): void {
    console.log(this.code);
  }

  getCode(){
    if(this.code.length > 0){
      console.log(this.code);
    }
  }

}
