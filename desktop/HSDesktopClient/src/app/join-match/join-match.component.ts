import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-join-match',
  templateUrl: './join-match.component.html',
  styleUrls: ['./join-match.component.css']
})
export class JoinMatchComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private config: ConfigService) { }

  ngOnInit() {
  }

  match;

  joinMatch(match: string) {
    //API call with logic to handle successful match join. If successful, proceed to 'ban'
this.match = match;
    this.router.navigate(['ban']);
  }

  back() {
    this.router.navigate(['tournament']);
  }

}
