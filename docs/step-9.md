#### Quick Jump ####
* [Step 1](./step-1.md)
* [Step 2](./step-2.md)
* [Step 3](./step-3.md)
* [Step 4](./step-4.md)
* [Step 5](./step-5.md)
* [Step 6](./step-6.md)
* [Step 7](./step-7.md)
* [Step 8](./step-8.md)
* **Step 9**
* [Step 10](./step-10.md)

## Step 9 task:
In this step we're going to allow users to delete talks. Since this action can lead to loss of data,
we'll implement a dialog that asks the user whether they're sure that they want to delete the talk.

To start things off, we'll add a new button to our card component and we'll adjust our layout
to fit the button. First of all, let's add a new button next to the "Edit talk" button.

`card.component.html`
```html
<mat-card-actions>
  <div class="author" *ngIf="author">By: {{author}}</div>
  <button mat-button (click)="delete.next()">DELETE</button>
  <button mat-button (click)="edit.next()">EDIT</button>
</mat-card-actions>
```

The `CardComponent` also needs a new `Output` for the `delete` event.
`card.component.ts`
```ts
@Component(})
export class CardComponent {
  ...
  @Output() delete = new EventEmitter<void>();
}
```

At this point you'll notice that there isn't enough space to fit everything inside the
`mat-card-actions` so we'll move the author text under the talk description.

`card.component.html`
```html
<mat-card>
  ...
  <mat-card-content>
    {{text}}
    <div *ngIf="author">By: {{author}}</div>
    ...
  </mat-card-content>
  <mat-card-actions>
    <button mat-button (click)="delete.next()">DELETE</button>
    <button mat-button (click)="edit.next()">EDIT</button>
  </mat-card-actions>
</mat-card>
```

We also have adjust our styling slightly so that the buttons are aligned towards the end of the
`mat-card-actions` and we can remove the `.author` styles since we won't need them anymore.

`card.component.scss`
```scss
.mat-card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

// Delete this rule completely, it's not used anymore.
.author {
  font-size: 14px;
  margin-left: 8px;
}
```

Now we can move onto creating the dialog that asks the user to confirm. We'll follow the same
pattern as with the edit dialog, however we can simplify it a bit since the dialog only needs two
buttons. We need to create the following files:

* `src/app/delete-talk/delete-talk.component.ts`
* `src/app/delete-talk/delete-talk.component.html`
* `src/app/delete-talk/delete-talk.component.scss`

Once we've created all the files, we can declare our simple dialog component. It won't have much
logic, besides exposing the talk that is currently being deleted.

`delete-talk.component.ts`
```ts
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
```

For the dialog's template, we only need a couple of buttons. Note the `cdkFocusInitial` attribute
on the "Delete" button. It instructs the CDK where to place the user's focus when they open the
dialog. Also note that we use the `mat-dialog-close` directive which allows us to close the dialog
declaratively, rather than having to do so through the component.

`delete-talk.component.html`
```html
Are you sure that you want to delete "{{talk.text}}"?

<mat-dialog-actions align="end">
  <button mat-button [mat-dialog-close]="false">Cancel</button>
  <button cdkFocusInitial mat-button [mat-dialog-close]="true">Delete</button>
</mat-dialog-actions>
```

To finish things up in the dialog, we can add some styling to make the buttons consistent with the
rest of the app.

`delete-talk.component.scss`
```scss
.mat-button {
  text-transform: uppercase;
}
```

Once our dialog is done, we need to declare it inside the `AppModule`.

`app.module.ts`
```ts
import { DeleteTalkComponent } from './delete-talk/delete-talk.component';

@NgModule({
  declarations: [
    ...
    DeleteTalkComponent,
  ],
  ...
  entryComponents: [EditTalkComponent, DeleteTalkComponent],
})
export class AppModule { }
```

Now that our dialog is ready to use, we can wrap everything up by hooking it up in the view.

`app.component.html`
```html
<ng-trello-card
  ...
  (delete)="deleteTalk(talk, track)"></ng-trello-card>
```

Finally, we have to implement the `deleteTalk` method which takes in the talk that we want to delete
and the track that it belongs to.

`app.component.ts`
```ts
import { DeleteTalkComponent } from './delete-talk/delete-talk.component';

@Component()
export class AppComponent {
  ...

  deleteTalk(talk: Talk, track: Track) {
    // Open a dialog
    this._dialog.open(DeleteTalkComponent, {data: talk, width: '500px'})
      .afterClosed()
      .subscribe(response => {
        // Wait for it to close and delete the talk if the user agreed.
        if (response) {
          track.talks.splice(track.talks.indexOf(talk), 1);
        }
      });
  }
}
```

[Continue to the next step](./step-10.md)
