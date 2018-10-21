import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Talk } from '../data.service';

@Component({
  selector: 'ng-trello-edit-talk',
  templateUrl: './edit-talk.component.html',
  styleUrls: ['./edit-talk.component.scss'],
})
export class EditTalkComponent {

  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public talk: Talk, private dialogRef: MatDialogRef, formBuilder: FormBuilder) {
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
