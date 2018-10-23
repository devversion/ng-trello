import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Talk } from '../data.service';

@Component({
  selector: 'ng-trello-delete-talk',
  templateUrl: './delete-talk.component.html',
  styleUrls: ['./delete-talk.component.scss'],
})
export class DeleteTalkComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk) {}
}
