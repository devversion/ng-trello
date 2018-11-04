#### Quick Jump ####
* [Step 1](./step-1.md)
* [Step 2](./step-2.md)
* [Step 3](./step-3.md)
* [Step 4](./step-4.md)
* **Step 5**
* [Step 6](./step-6.md)
* [Step 7](./step-7.md)
* [Step 8](./step-8.md)
* [Step 9](./step-9.md)
* [Step 10](./step-10.md)

## Step 5 task:

In this step we're going to make it possible to add new talks to a track and we're going to rework
the styling of our `card-list` to have a sticky header and footer.

First of all, we're going to add a new method to our `AppComponent` that will add a blank talk
to a track:

`app.component.ts`
```ts
import { BoardService, Track } from './data.service';

@Component()
export class AppComponent {
  ...

  addNewTalk(track: Track) {
    track.talks.push({
      text: 'New talk'
    });
  }
}
```

Now that our logic is in place, we can add the button that creates the talk.
`app.component.html`
```html
<div class="board">
  <div class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
    <h2 class="mat-h2">{{track.title}}</h2>
    <ng-trello-card *ngFor="let talk of track.talks">...</ng-trello-card>
    <button (click)="addNewTalk(track)" color="primary" mat-raised-button>Add talk</button>
  </div>
</div>
```

At this point we've achieved our goal of allowing users to add new talks, however the UX isn't
great, because the "Add talk" button is pushed out of the viewport for tracks with a lot of talks.
We can make it better by wrapping the `ng-trello-card` inside another element called
`card-list-content` and only making the list content scrollable, while the header and button stay
in place.

`app.component.html`
```html
<div class="board">
  <div class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
    <h2 class="mat-h2">{{track.title}}</h2>

    <!-- Add the card-list content around all the cards. -->
    <div class="card-list-content">
      <ng-trello-card *ngFor="let talk of track.talks">...</ng-trello-card>
    </div>
    <button (click)="addNewTalk(track)" color="primary" mat-raised-button>Add talk</button>
  </div>
</div>
```

`app.component.scss`
```scss
.card-list {
  // Makes it possible for the `card-list-content ` to take up the remaining space.
  display: flex;
  flex-direction: column;

  h2 {
    // Extra spacing to make things look better.
    margin-bottom: 5px;
  }

  button {
    // The flex-shrink prevents the button from shrinking if the list content becomes too large.
    flex-shrink: 0;
    margin-top: 10px;
  }
}

.card-list-content {
  // Make the list scrollable and stretch it to take up the available height.
  overflow: auto;
  flex-grow: 1;
}
```

[Continue to the next step](./step-6.md)
