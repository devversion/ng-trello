import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawerComponent } from './drawer/drawer.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatInputModule
} from '@angular/material';
import { BoardService } from './data.service';
import { CardComponent } from './card/card.component';
import { EditTalkComponent } from './edit-talk/edit-talk.component';
import { DeleteTalkComponent } from './delete-talk/delete-talk.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DrawerComponent,
    CardComponent,
    EditTalkComponent,
    DeleteTalkComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
  ],
  providers: [BoardService],
  bootstrap: [AppComponent],
  entryComponents: [EditTalkComponent, DeleteTalkComponent],
})
export class AppModule { }
