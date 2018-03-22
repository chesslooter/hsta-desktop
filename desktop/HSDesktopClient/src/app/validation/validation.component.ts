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
  
  decks = ['Murloc Paladin'];
  activeCardList=[];

  ngOnInit() {  
    //Call API and get registered decks for user, set decks[] equal to this
    //Can get cards all at once here, and then bind activeCardsList upon selecting deck button,
    //as opposed to in validate()
  }

  back() {
    this.router.navigate(['decklists']);
  }

  validate() {
    this.config.verify()
    
    //First, must call API to retrieve list of cards for selected deck and setting activeCardList[] equal to this
    //Then, must call Brian's script, getting each card as it is played and checking to see if it's in activeCardList[]
    //If this ever fails, end Brian's script and go to error
    //Otherwise, continue until Brian gives "Match End"
    //Button should be disabled up until "Match End"
  }

  decksEntered():boolean{
    return(this.decks.length > 0);
  }
}
