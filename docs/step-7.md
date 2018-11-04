#### Quick Jump ####
* [Step 1](./step_1.md)
* [Step 2](./step_2.md)
* [Step 3](./step_3.md)
* [Step 4](./step_4.md)
* [Step 5](./step_5.md)
* [Step 6](./step_6.md)
* **Step 7**
* [Step 8](./step_8.md)
* [Step 9](./step_9.md)
* [Step 10](./step_10.md)

## Step 7 task:
In this step we're going to build on top of the drag&drop functionality from step #6 by making it
possible to sort the tracks within a board. The main difference between sorting tracks and sorting
talks is that our tracks are laid out horizontally, and we don't have to worry about transferring
between lists.

Enabling sorting for the tracks is as simple as adding the `cdkDropList` to our board, making
the track draggable via `cdkDrag` and listening for the `cdkDropListDropped` event. We also have
to remember to set the `cdkDropListOrientation` attribute to `horizontal`, otherwise the CDK will
assume that the list is vertical.

`app.component.html`
```html
<div class="board"
      cdkDropList
      [cdkDropListData]="board.tracks"
      (cdkDropListDropped)="onTrackDrop($event)"
      cdkDropListOrientation="horizontal">
  <div cdkDrag class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
    <h2 class="mat-h2">{{track.title}}</h2>
    ...
  </div>
</div>
```

Now we need to add our `onTrackDrop` handler that will move the data around. It'll use the same
`moveItemInArray` function that we used in step #6.

`app.component.ts`
```ts
@Component()
export class AppComponent {
  ...

  onTrackDrop(event: CdkDragDrop<Track[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}
```

At this point sorting our tracks works, but we can make it better by adding a drag handle. A handle
inside a `cdkDrag` tells the CDK to only allow dragging the element when the user is pressing on a
specific element, rather than making the entire element draggable. In our case the handle will be
the track's title. Turning the title into a handle is as simple as adding the `cdkDragHandle`
attribute to it.

`app.component.html`
```html
<div cdkDrag class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
  <h2 cdkDragHandle class="mat-h2">{{track.title}}</h2>
  ...
</div>
```
