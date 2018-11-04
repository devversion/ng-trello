#### Quick Jump ####
* [Step 1](./step_1.md)
* [Step 2](./step_2.md)
* [Step 3](./step_3.md)
* [Step 4](./step_4.md)
* [Step 5](./step_5.md)
* [Step 6](./step_6.md)
* [Step 7](./step_7.md)
* **Step 8**
* [Step 9](./step_9.md)
* [Step 10](./step_10.md)

## Step 8 task:

In this step we're going to add functionality that allows users to edit existing
talks through a dialog.

Angular Material comes with a `MatDialog` service that can be used to show dialogs
that follow the Material Design specifications. Note that you are still extremely
flexible because the developer is responsible for providing a `Component` that will
be rendered as the dialog.

Since we want to use the `MatDialog` service, we first need to create a new Angular
component that will serve the content of the dialog.

For CLI users: You can run `ng generate component edit-talk`. Otherwise, if we want
to create the component manually, we need to create the following files:

* `src/app/edit-talk/edit-talk.component.ts`
* `src/app/edit-talk/edit-talk.component.html`
* `src/app/edit-talk/edit-talk.component.scss`

Once these files have been created, we can start setting up the `EditTalkComponent` 
by creating a plain new Angular component that just injects data which comes
from the `MatDialog` service.

> Note: Data for a dialog is usually provided through dependency injection and can be
injected by using the `MAT_DIALOG_DATA` injection token.

`src/app/edit-talk/edit-talk.component.ts`
```ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Talk } from '../data.service';

 @Component({
  selector: 'ng-trello-edit-talk',
  templateUrl: './edit-talk.component.html',
  styleUrls: ['./edit-talk.component.scss'],
})
export class EditTalkComponent {

   constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk) {}
}
```

Now that we have the basic component set up, we should add some form
controls that allow editing a talk. In order to do this, we add the following
`HTML` to the template.

`src/app/edit-talk/edit-talk.component.html`
```html
<form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
  <img *ngIf="talk.image" [src]="talk.image" alt="Talk image preview">
   <mat-form-field>
    <input matInput placeholder="Talk description" required formControlName="text">
  </mat-form-field>
   <mat-form-field>
    <input matInput placeholder="Speaker" required formControlName="speaker">
  </mat-form-field>
   <mat-form-field>
    <input matInput placeholder="Image URL" formControlName="image">
  </mat-form-field>
   <mat-dialog-actions align="end">
    <!--
      mat-dialog-close is a directive from the `MatDialogModule` which can be used
      to close the current dialog in a declarative way on element click.
    -->
    <button mat-button mat-dialog-close>Cancel</button>
    
    <button mat-button type="submit" [disabled]="formGroup.invalid">Update</button>
  </mat-dialog-actions>
</form>
```

Once we have set up the dialog template, you might have realized that we are using
multiple directives which are not imported in our app module.

The next task is to import the given modules in our app module, as well as adding
the new `EditTalkComponent` to the app declarations. Note that `EditTalkComponent`
will be rendered dynamically and therefore needs to be added to the `entryComponents`
section.

`src/app/app.module.ts`
```ts
  ...
  MatDialogModule,
  MatInputModule,
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { EditTalkComponent } from './edit-talk/edit-talk.component';

@NgModule({
  declarations: [
    ...
    EditTalkComponent,
  ],
  imports: [
    ...
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  entryComponents: [EditTalkComponent],
})
```

At this point, the edit component is already declared in our app module but does
not work yet. We still need to set up the form group and handle the dialog close.

In order to programmatically close a dialog, developers need to inject the
`MatDialogRef` class that refers to the current dialog and provides a method
for closing the current dialog.

`src/app/edit-talk/edit-talk.component.ts`
```ts
export class EditTalkComponent {

   formGroup: FormGroup;
   
   constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk,
              private dialogRef: MatDialogRef<EditTalkComponent>,
              formBuilder: FormBuilder) {

     this.formGroup = formBuilder.group({
      text: [talk.text, Validators.required],
      speaker: [talk.speaker, Validators.required],
      image: [talk.image, Validators.required],
    });
  }
  
  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }
}
```

Even though the edit dialog is technically ready now, it still lacks
some custom styles in order to make the user-experience better.

`src/app/edit-talk/edit-talk.component.scss`
```scss
$dialog-default-padding: 24px;
$edit-talk-dialog-width: 500px;

img {
  width: $edit-talk-dialog-width;
  
  // Shift the image to ignore the default margin of the dialog. We want to
  // show the talk image as a full-width dialog header.
  margin: (-$dialog-default-padding) (-$dialog-default-padding) 0px;
  padding-bottom: 8px;
}

.mat-form-field {
  display: block;
}

.mat-button {
  text-transform: uppercase;
}
```

Finally, our edit talk component is finished and we can start using the `MatDialog`
service to open the edit talk dialog. In order to launch the dialog, we need to
inject the `MatDialog` service in our `AppComponent`.

While being at it, we also implement the `editTalk` method that should be called
whenever we want to edit a given talk.

`src/app/app.component.ts`
```ts
import { MatDialog } from '@angular/material';
import { EditTalkComponent } from './edit-talk/edit-talk.component';

export class AppComponent {
  ...
  
  constructor(private _boardService: BoardService, private _dialog: MatDialog) {}
  
  editTalk(talk: Talk) {
    // Use the injected dialog service to launch the previously created edit-talk
    // component. Once the dialog closes, we assign the updated talk data to
    // the specified talk. 
    this._dialog.open(EditTalkComponent, {data: talk, width: '500px'})
      .afterClosed()
      .subscribe(newTalkData => Object.assign(talk, newTalkData));
  }
``` 

At this point, we've fulfilled all the perquisites for opening dialog, and just
need to call the `editTalk` method whenever the `EDIT` button in the talk card
has been pressed.

Since the edit button is part of a child component, we need to notify the parent
component (`AppComponent`) which holds the data, about the button click.

We achieve this by using the `@Output` concept which is commonly used for
communication between components.

`src/app/card/card.component.ts`
```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

export class CardComponent {
  ...

  @Output() edit = new EventEmitter<void>();
}
```

Now that we have our output defined, we need to emit a value whenever the
edit button is pressed.

`src/app/card/card.component.html`
```html
<button mat-button (click)="edit.next()">EDIT</button>
```

To complete this step, we now need to call the `editTalk` method
whenever the `(edit)` output of an `<ng-trello-card>` component fires.

`src/app/app.component.html`
```html
<ng-trello-card
  ...
  (edit)="editTalk(talk)"></ng-trello-card>
```
