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
  validating;
  tID;

  ngOnInit() {  
    this.data.currentDecks.subscribe(decks => this.decks=decks);
    this.data.currentDeckCodes.subscribe(deckCodes=>this.deckCodes=deckCodes);
    this.data.currentUserID.subscribe(uID =>this.uID = uID);
    this.data.currentValidating.subscribe(val => this.validating = val);
  }

  back() {
    this.router.navigate(['match']);
  }

  validate() {
    this.config.verify(this.uID, this.oID, this.tID);    
  }

}
