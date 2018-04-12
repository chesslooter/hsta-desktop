import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-decklists',
  templateUrl: './decklists.component.html',
  styleUrls: ['./decklists.component.css']
})
export class DecklistsComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private config: ConfigService) {}

  userID: string;
  battleTag: string;
  nDeckName: string;
  nDeckCode: string;
  decks = [];
  deckCodes = [];

  ngOnInit() {
    this.data.currentUserID.subscribe(message => this.userID = message);
    this.data.currentBattleTag.subscribe(message => this.battleTag = message);
    this.data.currentDecks.subscribe(decks=> this.decks = decks);
    this.data.currentDeckCodes.subscribe(deckCodes=> this.deckCodes = deckCodes); 

    console.log(this.decks.length);
    console.log(this.deckCodes.length);
  }

  addDeck(deckName: string, deckCode: string) {
    if (deckName && deckCode) {
      this.decks.push(deckName);
      this.deckCodes.push(deckCode);
      this.config.addDeck(this.userID, deckCode, deckName)
        .subscribe(response => console.log(response));
      this.data.changeDecks(this.decks);
      this.data.changeDeckCodes(this.deckCodes);
      this.nDeckName = "";
      this.nDeckCode = "";
    }
    else {
      //Let user know there was a problem
    }
  }

  back() {
    this.router.navigate(['menu']);
  }

  decksEntered(): boolean {
    if (this.decks) {
      return (this.decks.length > 0)
    }
    return false;
  }

  deleteDeck(deckName: string) {
    var i = this.decks.indexOf(deckName);
    if(i != -1){
      this.config.deleteDeck(this.userID, this.deckCodes[i])
      .subscribe(res => console.log(res));
      this.decks.splice(i,1);   
      this.deckCodes.splice(i,1);
    }    
  }
  
}
