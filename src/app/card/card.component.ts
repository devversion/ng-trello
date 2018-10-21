import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ng-trello-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss']
})
export class CardComponent {
  @Input() text: string;
  @Input() author: string;
  @Input() tags: string[];
  @Input() image: string;

  @Output() edit = new EventEmitter<void>();
}
