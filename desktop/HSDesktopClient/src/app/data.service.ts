import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private battleTagSource = new BehaviorSubject<string>("");
  private userIDSource = new BehaviorSubject<string>("");
  private decksSource = new BehaviorSubject<string[]>([]);
  private deckCodesSource = new BehaviorSubject<string[]>([]);
  private validatingSource = new BehaviorSubject<boolean>(false);
  private activeTournamentSource = new BehaviorSubject<number>(-1);
  private matchSource = new BehaviorSubject<string>("");
  private opponentSource = new BehaviorSubject<string>("");

  currentBattleTag = this.battleTagSource.asObservable();
  currentUserID = this.userIDSource.asObservable();
  currentDecks = this.decksSource.asObservable();
  currentDeckCodes = this.deckCodesSource.asObservable();
  currentValidating = this.validatingSource.asObservable();
  currentActiveTournament = this.activeTournamentSource.asObservable();
  currentMatch = this.matchSource.asObservable();
  currentOpponent = this.opponentSource.asObservable();

  constructor() { }

  changeUserID(ID: string) {
    this.userIDSource.next(ID)
  }

  changeActiveTournament(ID: number) {
    this.activeTournamentSource.next(ID)
  }

  changeValidating(val: boolean) {
    this.validatingSource.next(val)
  }

  changeBattleTag(battleTag: string) {
    this.battleTagSource.next(battleTag)
  }

  changeMatch(match: string) {
    this.matchSource.next(match)
  }

  changeOpponent(opponent: string) {
    this.opponentSource.next(opponent)
  }

  changeDecks(decks: string[]) {
    this.decksSource.next(decks)
  }

  changeDeckCodes(deckCodes: string[]) {
    this.deckCodesSource.next(deckCodes)
  }

}