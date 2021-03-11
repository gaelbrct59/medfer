import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  code: string;
  constructor(private route:ActivatedRoute) {
    this.code = "ddd";
   }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      this.code = params['code'];
    })
  }

}
