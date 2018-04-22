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
  uID;
  oID = "";

  ngOnInit() {  
    this.data.currentDecks.subscribe(decks => this.decks=decks);
    this.data.currentDeckCodes.subscribe(deckCodes=>this.deckCodes=deckCodes);
    this.data.currentUserID.subscribe(uID =>this.uID = uID);
    //Call API and get registered decks for user, set decks[] equal to this
    //Can get cards all at once here, and then bind activeCardsList upon selecting deck button,
    //as opposed to in validate()
  }

  back() {
    this.router.navigate(['match']);
  }

  validate() {
    this.config.verify(this.uID, this.oID);    
    //First, must call API to retrieve list of cards for selected deck and setting activeCardList[] equal to this
    //Then, must call Brian's script, getting each card as it is played and checking to see if it's in activeCardList[]
    //If this ever fails, end Brian's script and go to error
    //Otherwise, continue until Brian gives "Match End"
    //Button should be disabled up until "Match End"
  }

}
