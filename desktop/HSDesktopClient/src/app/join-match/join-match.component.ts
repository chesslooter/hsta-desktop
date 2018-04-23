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
    this.match = match;
    this.data.changeActiveTournament(1);
      this.router.navigate(['validation']);
      /*

    console.log(this.userID);
    console.log(this.match);
   this.config.joinMatch(this.userID, this.match)
      .subscribe(res => console.log(res)/*this.postJoin(res));*/
      
  }

  postJoin(success) {
    if (success) {
      //Add post API call shiz to set active tournament
      this.data.changeActiveTournament(1);
      this.router.navigate(['validation']);
    }
    else {
      document.getElementById('match').className = "form-control is-invalid";
      console.log("Unsuccessful SErver Response");
    }
  }

  back() {
    this.router.navigate(['tournament']);
  }

}
