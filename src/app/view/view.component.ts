import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  
  code: string;
  nameuser: string;
  constructor(private route:Router) { 
    this.code = "";
  }

  ngOnInit(): void {
  }

  getCode(){
    
    if(this.code.length > 0 /*&& this.nameuser.length > 0*/){
      this.route.navigate(['/repository'], {queryParams: {code: this.code}});
    }else{
      alert("Remplir");
    }
  }

}
