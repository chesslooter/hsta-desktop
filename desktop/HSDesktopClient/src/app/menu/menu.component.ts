import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "../data.service";
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private config: ConfigService) { }

  battleTag: string;
  userID: string;
  decks = [];
  deckCodes = [];

  ngOnInit() {
    this.data.currentUserID.subscribe(message => this.userID = message);
    this.data.currentBattleTag.subscribe(message => this.battleTag = message);
    this.config.getUserDecklists(this.userID)
      .subscribe(response => this.postGetDecks(response.deck_names,response.decks));
  }

  postGetDecks(deck: string[],deckStrings: string[]){  
    //Set decks with info from server
    this.data.changeDecks(deck);
    this.data.changeDeckCodes(deckStrings);
    
    //Subscribe to decks and Deck Codes
    this.data.currentDecks.subscribe(decks=> this.decks = decks);
    this.data.currentDeckCodes.subscribe(deckCodes=> this.deckCodes = deckCodes); 
  }

  decklists() {
    this.router.navigate(['decklists']);
  }

  enterTournament() {
    this.router.navigate(['tournament']);
  }

  exit() {
    //Electron only. Send message to main process to kill app
    this.config.exit()
  }
}
