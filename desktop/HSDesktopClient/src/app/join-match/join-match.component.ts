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
    this.data.currentActiveTournament.subscribe(id => this.tID = id);
  }

  match;
  userID: string;
  tID;

  joinMatch(match: string) {
    this.match = match;
   this.config.joinMatch(this.userID, this.match)
      .subscribe(res => this.postJoin(res));      
  }

  postJoin(res) {
    if (res['success'] && (this.userID == res['match']['homeTeamId'] || this.userID ==res['match']['awayTeamId'])) {
      this.data.changeActiveTournament(this.tID);
      this.router.navigate(['validation']);
    }
    else {
      document.getElementById('match').className = "form-control is-invalid";
      console.log("Unsuccessful Server Response");
    }
  }

  back() {
    this.router.navigate(['tournament']);
  }

}
