import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import 'rxjs/Rx';
import { concat } from 'rxjs/operator/concat';
import { DataService } from './data.service';

@Injectable()
export class ConfigService {
  private url = 'https://hsta-server.herokuapp.com';
  //private url = 'http://192.168.1.12:3000'; //Test URL for running server when not pushed to Heroku
  //private url = 'http://localhost:3000';

  constructor(private http: Http, private electronService: ElectronService, private data: DataService) { }

  // Calls API to retrieve decklists for a given user
  getUserDecklists(userid) {
    return this.http.get(this.url + '/api/get_user_decklists?userid=' + userid).map(res => res.json());
  }

  // Calls API to add a deck to a user's list of entered decks
  addDeck(userid, deckcode, deckname) {
    return this.http.get(this.url + '/api/add_deck?userid=' +
      userid + '&deckcode=' + deckcode + '&deckname=' + deckname).map(res => res.json());
  }

  // Calls API to remove a deck from a user's list of entered decks
  deleteDeck(userid, deckcode) {
    console.log('delete that');
    return this.http.get(this.url + '/api/delete_deck?userid=' +
      userid + '&deckcode=' + deckcode).map(res => res.json());
  }

  // Calls API to create a new user in DB with given BattleTag
  createUser(bTag) {
    return this.http.get(this.url + '/api/create_user?battletag=' + bTag).map(res => res.json());
  }

  // Calls API to login with an existing BattleTag in our DB
  login(bTag) {
    return this.http.get(this.url + '/api/login?battletag=' + bTag).map(res => res.json());
  }

  // Electron only. Calls into Log Reader to start waiting for info from the log file. Once match is complete,
  // info is sent back, parsed, and sent to API endpoint to determine validity
  verify(uID, oID, tID) {
    var uBody = {};
    var uDeck = {};
    var oBody = {};
    var oDeck = {};
    this.electronService.ipcRenderer.send('startValidation');
    var self = this;
    this.electronService.ipcRenderer.once('logF', (event, arg) => {
      for (var i = 0; i < arg.length; i++) {
        uDeck[arg[i]['cardId']] = arg[i]['count'];
      }
      uBody['userid'] = uID;
      console.log(uID);
      uBody['deckjson'] = <JSON>uDeck;
      uBody['tournamentid']=tID;
      console.log(tID);
      console.log(uDeck);
      this.http.post(this.url + '/api/validate_decklist', <JSON>uBody).map(res => res.json()).subscribe(res => self.unlock(res));
    });
    this.electronService.ipcRenderer.once('logO', (event, arg) => {
      for (var i = 0; i < arg.length; i++) {
        oDeck[arg[i]['cardId']] = arg[i]['count'];
      }
      oBody['userid'] = oID;
      oBody['deckjson'] = oDeck;
      this.http.post(this.url + '/api/validate_decklist', oBody).map(res => res.json()).subscribe(res => console.log(res));
    });
  }

  unlock(res){
    console.log('unlocking');
  }

  // Calls API to join tournament. If already joined, returns decks user has submitted
  joinTournament(userID, tournamentID) {
    return this.http.get(this.url + '/api/join_tournament?userid=' + userID + '&tournamentid=' + tournamentID)
      .map(res => res.json());
  }

  // Calls API to submit decks to tournament 
  submitDecks(userID, tournamentID, deckCodes) {
    var codes: string = '';
    for (var i = 0; i < deckCodes.length; i++) {
      if (i != deckCodes.length - 1) {
        codes = codes.concat(deckCodes[i], ',');
      }
      else {
        codes = codes.concat(deckCodes[i]);

      }
    }
    return this.http.get(this.url + '/api/add_tournament_deck?userid=' + userID + '&tournamentid=' + tournamentID + '&deckcode=' + codes)
      .map(res => res.json());
  }

  // Calls API to join a tournament in a match. Returns false if MatchID is invalid, or if user is not in given match
  joinMatch(userID, matchID) {
    return this.http.get(this.url + '/api/get_match?userid=' + userID + '&matchid=' + matchID)
      .map(res => res.json());
  }

  // Electron only command to exit app
  exit() {
    this.electronService.ipcRenderer.send('kill');
  }

}
