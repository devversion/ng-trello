import { Component } from '@angular/core';
import { BoardService, Track } from './data.service';

@Component({
  selector: 'ng-trello-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-trello';

  constructor(private _boardService: BoardService) {}

  get board() {
    return this._boardService.currentBoard;
  }

  addNewTalk(track: Track) {
    track.talks.unshift({
      text: 'New talk'
    });
  }
}
