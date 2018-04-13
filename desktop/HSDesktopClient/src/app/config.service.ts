import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import 'rxjs/Rx';
import { concat } from 'rxjs/operator/concat';

@Injectable()
export class ConfigService {
  private url = 'https://hsta-server.herokuapp.com';
  //private url = 'http://192.168.1.12:3000'; //Test URL for running server when not pushed to Heroku
  //private url = 'http://localhost:3000';

  constructor(private http: Http, private electronService: ElectronService) { }

  getUserDecklists(userid) {
    return this.http.get(this.url + '/api/get_user_decklists?userid=' + userid).map(res => res.json());
  }

  addDeck(userid, deckcode, deckname) {      
    return this.http.get(this.url + '/api/add_deck?userid=' + 
            userid + '&deckcode=' + deckcode + '&deckname=' + deckname).map(res => res.json());
  }

  deleteDeck(userid, deckcode) {
    console.log('delete that');
    return this.http.get(this.url + '/api/delete_deck?userid=' + 
            userid + '&deckcode=' + deckcode).map(res=>res.json());
  }

  updateDecklistName(userid, deckcode, deckname) {
    return this.http.get(this.url + '/api/update_decklist_name?userid=' + 
            userid + '&deckcode=' + deckcode + '&deckname=' + deckname).map(res=>res.json());
  }

  createUser(email) {
    return this.http.get(this.url + '/api/create_user?battletag=' + email).map(res => res.json());
  }

  login(email) {
    return this.http.get(this.url + '/api/login?battletag=' + email).map(res => res.json());
  }

  verify(){
    this.electronService.ipcRenderer.send('startValidation');
    this.electronService.ipcRenderer.once('logF', (event, arg) => {
      console.log(arg);
    });
    this.electronService.ipcRenderer.once('logO', (event, arg) => {
      console.log(arg);
    });
  }

  joinTournament(userID, tournamentID){
    return this.http.get(this.url + '/api/join_tournament?userid='+userID +'&tournamentid='+tournamentID)
    .map(res => res.json());
  }

  submitDecks(userID, tournamentID, deckCodes){
    var codes: string = '';
    for(var i =0; i<deckCodes.length; i++){
      if(i != deckCodes.length-1) {
        codes = codes.concat(deckCodes[i],',');
      }
      else {
        codes = codes.concat(deckCodes[i]);

      }
    }
    return this.http.get(this.url +'/api/add_tournament_deck?userid='+userID+'&tournamentid='+tournamentID+'&deckcode='+codes)
    .map(res => res.json());
  }

  joinMatch(userID, matchID) {
    return this.http.get(this.url +'/api/get_match?userid='+userID+'&matchid='+matchID)
    .map(res=>res.json());
  }

  exit(){
    this.electronService.ipcRenderer.send('kill');
  }



}
