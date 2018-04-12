import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs/Observable';

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
  numDecks = 0;
  success = false;
  tournament;


  ngOnInit() {    
    this.data.currentDecks.subscribe(decks => this.decks=decks);
    this.data.currentDeckCodes.subscribe(deckCodes=>this.deckCodes);
    this.data.currentUserID.subscribe(message => this.userID = message);
  }

  joinTournament(tournament: string) {
    //TODO: add logic to check if tournament is valid. If so, open up option to select decks with number 
    //equal to those valid for the tournament
    this.success = true;
    this.tournament = tournament;
    //this.config.joinTournament(this.userID,this.tournament)
    //.subscribe(res => console.log(res));
    if(this.success){
      console.log("succ");
    }
    //
  }

  submitDecks(){
    this.router.navigate(['match']);
  }

  addTournamentDeck(deckName: string){
     if(this.enteredDecks.includes(deckName)){
      var i = this.enteredDecks.indexOf(deckName);
      this.enteredDecks.splice(i,1);
     }
     else{
       this.enteredDecks.push(deckName);
     }
  }

  validSubmit(){
    return !(this.numDecks == this.enteredDecks.length);
  }

  deckMax(deckName: string){
    if(this.numDecks > this.enteredDecks.length) {
      return false;
    }
    return !this.active(deckName);
  }

  active(deckName: string){
    return(this.enteredDecks.includes(deckName));
  }



  back() {
    this.router.navigate(['menu']);
  }

}
