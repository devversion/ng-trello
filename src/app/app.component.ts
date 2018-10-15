import { Component } from '@angular/core';
import { BoardService } from './data.service';

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
}
