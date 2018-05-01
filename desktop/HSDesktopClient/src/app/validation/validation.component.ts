import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private config: ConfigService) { }
  
  decks = [];
  deckCodes = [];
  activeCardList=[];
  uID : string;
  oID : string;
  validating;
  tID : number;
  mID : string;

  ngOnInit() {  
    this.data.currentDecks.subscribe(decks => this.decks=decks);
    this.data.currentDeckCodes.subscribe(deckCodes=>this.deckCodes=deckCodes);
    this.data.currentUserID.subscribe(uID =>this.uID = uID);
    this.data.currentValidating.subscribe(val => this.validating = val);
    this.data.currentActiveTournament.subscribe(tID => this.tID = tID);
    this.data.currentOpponent.subscribe(id => this.oID = id);
    this.data.currentMatch.subscribe(id => this.mID = id);

  }

  back() {
    this.router.navigate(['match']);
  }

  validate() {
    console.log("userID: " + this.uID);
    console.log("userID: " + this.oID);
    console.log("userID: " + this.tID);
    console.log("userID: " + this.mID);

    this.config.verify(this.uID, this.oID, this.tID, this.mID);    
  }

}
