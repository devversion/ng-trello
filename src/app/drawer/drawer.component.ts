import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardService, Board } from '../data.service';

@Component({
  selector: 'ng-trello-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  boards: Board[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private boardService: BoardService) {
    this.boards = boardService.getBoards();
  }

  get currentBoard() {
    return this.boardService.currentBoard;
  }

  activate(board: Board) {
    this.boardService.currentBoard = board;
  }
}
