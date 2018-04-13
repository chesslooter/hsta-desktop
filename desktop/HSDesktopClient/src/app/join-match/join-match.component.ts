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
    this.data.currentUserID.subscribe(message => this.userID = message);
  }

  match;
  userID: string;


  joinMatch(match: string) {
    //API call with logic to handle successful match join. If successful, proceed to 'ban'
    this.match = match;
    //this.config.joinMatch(this.userID,this.match)
    //.subscribe(res => console.log(res));
    //this.router.navigate(['ban']);
    this.router.navigate(['validation']);

  }

  postJoin(success){
    if(success){

      this.router.navigate(['validation']);
    }
    else {
      console.log('unsuccessful server response');
    }
  }

  back() {
    this.router.navigate(['tournament']);
  }

}
