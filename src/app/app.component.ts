import { Component } from '@angular/core';
import { BoardService, Talk, Track } from './data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { EditTalkComponent } from './edit-talk/edit-talk.component';

@Component({
  selector: 'ng-trello-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-trello';

  constructor(private _boardService: BoardService, private _dialog: MatDialog) {}

  get board() {
    return this._boardService.currentBoard;
  }

  get trackIds(): string[] {
    return this.board.tracks.map(track => track.id);
  }

  editTalk(talk: Talk) {
    this._dialog.open(EditTalkComponent, {data: talk, width: '500px'})
      .afterClosed()
      .subscribe(newTalkData => Object.assign(talk, newTalkData));
  }

  addNewTalk(track: Track) {
    track.talks.unshift({
      text: 'New talk'
    });
  }

  onTalkDrop(event: CdkDragDrop<Talk[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onTrackDrop(event: CdkDragDrop<Track[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}
