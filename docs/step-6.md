#### Quick Jump ####
* [Step 1](./step-1.md)
* [Step 2](./step-2.md)
* [Step 3](./step-3.md)
* [Step 4](./step-4.md)
* [Step 5](./step-5.md)
* **Step 6**
* [Step 7](./step-7.md)
* [Step 8](./step-8.md)
* [Step 9](./step-9.md)
* [Step 10](./step-10.md)

## Step 6 task:

In this step we're using the `DragDropModule` which has been recently introduced as part of
the Angular Component Devkit V7. Our goal is to make the individual talks
(or `<ng-trello-card>` elements) sortable and transferable.

This means that we want to allow users to manually sort and move talks between different tracks using
drag and drop.

First of all, we need to add the aforementioned `DragDropModule` to our app module.

`src/app/app.module.ts`
```ts
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  ...
  imports: [
    ...
    DragDropModule,
  ],
```

Now, since we have imported the drag and drop utilities from the CDK, we can use its directives
to enable dragging for our talks. Making elements draggable and sortable is as simple as placing
two directives (`cdkDropList` and `cdkDrag`) onto two HTML elements.

| Directive     | Description                 |
| ------------- | --------------------------- |
| `cdkDrag`     | Makes an element draggable. | 
| `cdkDropList` | Groups draggables (`cdkDrag` elements) into a reorderable collection. Items will automatically rearrange as an element moves. Note that this will not update your data model |

`src/app/app.component.html`
```html
<h2 class="mat-h2">{{track.title}}</h2>

<!--
 Add the `cdkDropList` directive and bind it to the talks array. We want to connect all talk drop lists
 through their ids. We could also use template variables, but ids are more convenient and less code
 in this case.
 -->
<div class="card-list-content"
     cdkDropList
     [id]="track.id"
     [cdkDropListData]="track.talks"
     [cdkDropListConnectedTo]="trackIds"
     (cdkDropListDropped)="onTalkDrop($event)">
     
  <!-- All Trello cards in the given track should be made draggable. -->
  <ng-trello-card
    cdkDrag
    ...
```

Once the template has been set up, we need to implement the properties and methods we specified
in our template bindings (`trackIds` and `onTalkDrop`).

Note that we need to implement the `onTalkDrop` logic because by default, the `@angular/cdk/drag-drop`
module expects the developer to take care of moving and transferring items between arrays.

`src/app/app.component.ts`
```ts
export class AppComponent {
  ...
  
  /**
   * An array of all track ids. Each id is associated with a `cdkDropList` for the
   * track talks. This property can be used to connect all drop lists together. 
   */
  get trackIds(): string[] {
    return this.board.tracks.map(track => track.id);
  }
  
  onTalkDrop(event: CdkDragDrop<Talk[]>) {
    // In case the destination container is different from the previous container, we
    // need to transfer the given talk to the target data array. This happens if
    // a talk has been dropped on a different track.
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
```

At this point, all talks are already draggable, transferable and sortable, but the user
experience is still not sufficient because there are no animations. We can easily add
animations by adding simple SCSS styles to our app component.

`src/app/app.component.scss`
```scss
// If items are being reordered through dragging, all other elements should
// reorder smoothly. Also if an item is being dropped, it should animate
// into its target position.
.cdk-drag-animating, .cdk-drop-list-dragging .cdk-drag {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

// Hides the placeholder if an element is being dragged.
.cdk-drag-placeholder {
  opacity: 0;
}
```

Now that we have improved the UX a bit, we still need to tackle another small issue that
appears since we use an `<img>` which is by default `draggable` in the browser.

If someone holds the cursor on the image, the actual talk should be dragged and not the
image. In order to fix it, we just need to disable the native browser dragging of
the `<img>` element.

`src/app/card/card.component.html`
```html
<img *ngIf="image" mat-card-image [src]="image" draggable="false">
```

[Continue to the next step](./step-7.md)
