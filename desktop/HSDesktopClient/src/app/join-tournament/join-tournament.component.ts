import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';

@Component({
  selector: 'app-join-tournament',
  templateUrl: './join-tournament.component.html',
  styleUrls: ['./join-tournament.component.css']
})
export class JoinTournamentComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private config: ConfigService) { }

  userID;
  decks = [];
  deckCodes = [];
  enteredDecks = [];
  enteredDeckCodes = [];
  numDecks = -1;
  success = false;
  tournament;
  locked = false;

  ngOnInit() {
    this.data.currentDecks.subscribe(decks => this.decks = decks);
    this.data.currentDeckCodes.subscribe(deckCodes => this.deckCodes = deckCodes);
    this.data.currentUserID.subscribe(message => this.userID = message);
  }

  joinTournament(tournament: string) {
    //TODO: add logic to check if tournament is valid. If so, open up option to select decks with number 
    //equal to those valid for the tournament    
    this.tournament = tournament;
    this.config.joinTournament(this.userID, this.tournament)
      .subscribe(res => this.postJoinTournament(res['success'], res['deck_names'], res['decks'], res['matches_played'], res['numDecks']));
  }

  postJoinTournament(success: boolean, eDecks, eDeckCodes, started: boolean, numDecks: number) {
    if (success) {
      this.numDecks = numDecks;
      if (eDecks.length > 0 && eDeckCodes.length > 0) {
        this.enteredDecks = eDecks;
        this.enteredDeckCodes = eDeckCodes;
        
        if (started) {
          this.locked = true;
        }
      }
      this.success = success;
    }
    else {
      console.log('unsuccessful server response');
    }
  }

  submitDecks() {
    this.config.submitDecks(this.userID,this.tournament,this.enteredDeckCodes)
    .subscribe(res => this.postSubmit(res['success']));
  }

  postSubmit(success: boolean) {
    if (success) {
      this.router.navigate(['match']);
    }
    else {
      console.log('unsuccessful server response');
    }
  }

  addTournamentDeck(deckName: string) {
    if (this.enteredDecks.includes(deckName)) {
      var i = this.enteredDecks.indexOf(deckName);
      this.enteredDecks.splice(i, 1);
      this.enteredDeckCodes.splice(i,1);
    }
    else {
      this.enteredDecks.push(deckName);
      var i = this.decks.indexOf(deckName);
      this.enteredDeckCodes.push(this.deckCodes[i]);
    }
  }

  validSubmit() {
    return !(this.numDecks == this.enteredDecks.length);
  }

  deckMax(deckName: string) {
    if (this.locked) return true;
    if (this.numDecks > this.enteredDecks.length) {
      return false;
    }
    return !this.active(deckName);
  }

  active(deckName: string) {
    return (this.enteredDecks.includes(deckName));
  }

  back() {
    this.router.navigate(['menu']);
  }

  checkmark(deckname){
    for(var i = 0; i<this.enteredDecks.length;i++){
      if(deckname == this.enteredDecks[i]){
        return "checked";
      }
    }
  }

}
