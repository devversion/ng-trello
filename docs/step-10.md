#### Quick Jump ####
* [Step 1](./step_1.md)
* [Step 2](./step_2.md)
* [Step 3](./step_3.md)
* [Step 4](./step_4.md)
* [Step 5](./step_5.md)
* [Step 6](./step_6.md)
* [Step 7](./step_7.md)
* [Step 8](./step_8.md)
* [Step 9](./step_9.md)
* **Step 10**

## Step 10 task:
If you've been following along up until now, you might have noticed that the user can edit any
field in a talk, except for the tags. In this step we'll use the Angular Material chip list to
make the list of tags editable.

To get started, we have to declare another `mat-form-field` inside the `edit-talk` component.
The form field will contain a `mat-chip-list` with the talk's tags, as well as an input in which
we can type our new tags.

`edit-talk.component.html`
```html
...
<mat-form-field>
  <!-- Add the chip list and associate it with a new form control. -->
  <mat-chip-list #tags formControlName="tags">
    <!--
      Render out all the chips that are set to the form control.
      Also listen for the `removed` event which will notify use when to remove a tag.
    -->
    <mat-chip *ngFor="let tag of this.formGroup.get('tags').value" (removed)="removeTag(tag)">
      {{tag}}
      <!-- Add an icon that allows the user to delete a talk via click. -->
      <mat-icon matChipRemove>cancel</mat-icon>
    </mat-chip>

    <!--
      Input into which the user can type new tags. The `matChipInputTokenEnd` event will fire
      whenever the user presses enter or they focus outside the input.
    -->
    <input placeholder="Add tags"
            [matChipInputFor]="tags"
            (matChipInputTokenEnd)="addTag($event)" />
  </mat-chip-list>
</mat-form-field>
...
```

Now that we have our markup, we need to add the logic. We'll need a new form control which will
keep track of the current chips, as well as two new event handlers: one when a chip is added and
one when it's deleted. Note that we'll be editing the value of the `FormControl` associated with
the tags, rather than the talk's tags directly. This allows us to automatically revert to
the previous value, if the user decides to press "Cancel".

`edit-talk.component.ts`
```ts
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';

@Component()
export class EditTalkComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk,
              private dialogRef: MatDialogRef<EditTalkComponent>,
              formBuilder: FormBuilder) {

    this.formGroup = formBuilder.group({
      ...
      tags: [talk.tags],
    });
  }

  removeTag(tag: string) {
    // Remove the tag from the tag control's value.
    const tagsControl = this.formGroup.get('tags');
    tagsControl.value.splice(tagsControl.value.indexOf(tag), 1);
  }

  addTag(event: MatChipInputEvent) {
    const tagsControl = this.formGroup.get('tags');

    // Create a new array of tags, if the talk doesn't have any,
    // otherwise add the new tag to the existing array.
    if (tagsControl.value) {
      tagsControl.value.push(event.value);
    } else {
      tagsControl.setValue([event.value]);
    }

    // Clear the input's value once the tag has been added.
    event.input.value = '';
  }
}
```

At this point we don't need any more logic, because of all the groundwork we set up in the previous
steps. You can test out the new form field by pressing the "Edit" button on any of the talks and
interacting with the `mat-chip-list`.
