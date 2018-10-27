import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';
import { Talk } from '../data.service';

@Component({
  selector: 'ng-trello-edit-talk',
  templateUrl: './edit-talk.component.html',
  styleUrls: ['./edit-talk.component.scss'],
})
export class EditTalkComponent {

  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk,
              private dialogRef: MatDialogRef<EditTalkComponent>,
              formBuilder: FormBuilder) {

    this.formGroup = formBuilder.group({
      text: [talk.text, Validators.required],
      speaker: [talk.speaker, Validators.required],
      image: [talk.image],
      tags: [talk.tags],
    });
  }

  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }

  removeTag(tag: string) {
    const tagsControl = this.formGroup.get('tags');
    tagsControl.value.splice(tagsControl.value.indexOf(tag), 1);
  }

  addTag(event: MatChipInputEvent) {
    const tagsControl = this.formGroup.get('tags');

    if (tagsControl.value) {
      tagsControl.value.push(event.value);
    } else {
      tagsControl.setValue([event.value]);
    }

    event.input.value = '';
  }
}
