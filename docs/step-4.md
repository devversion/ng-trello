#### Quick Jump ####
* [Step 1](./step-1.md)
* [Step 2](./step-2.md)
* [Step 3](./step-3.md)
* **Step 4**
* [Step 5](./step-5.md)
* [Step 6](./step-6.md)
* [Step 7](./step-7.md)
* [Step 8](./step-8.md)
* [Step 9](./step-9.md)
* [Step 10](./step-10.md)

## Step 4 task:

In this step we're going to focus on creating the card layout UI and rendering out the data that we
set up during step #3. We'll also make it possible for the user to switch between boards.

First of all, we're going to do some groundwork so that we can use our data in the view.
We'll add a new property to the `BoardService` which will keep track of the board that the user
is interacting with. The default board will be the first one.

`app.data.service`
```ts
@Injectable({providedIn: 'root'})
export class BoardService {
  currentBoard = this._boards[0];
  ...
}
```

Now the data has to be exposed in the view:

`app.component.ts`
```ts
import { BoardService } from './data.service';

@Component()
export class AppComponent {
  constructor(private _boardService: BoardService) {}

  get board() {
    return this._boardService.currentBoard;
  }
}
```

Once our data is in the view, we can move on to creating and styling the components necessary to
display it. The card layout will consist of the following elements:

* Card - represents a single item in our Trello board.
* List - groups a set of cards together. Will be used to represent a track.
* Board - groups a set tracks.

### Board
For the board we need to create a container that spans the height of the viewport and which will lay
out our card lists horizontally. Furthermore, the board needs to be able to become scrollable if
the amount of lists doesn't fit in the viewport. Since our board styles and template are fairly
simple and don't involve any extra logic, we're going to put them directly into our `AppComponent`.

First of all, we need to put a board in our view so that we can style it:

`app.component.html`
```html
<ng-trello-drawer>
  <div class="board"></div>
</ng-trello-drawer>
```

Now that we have our element, we have to add the styles:
`app.component.scss`
```scss
.board {
  // Flexbox styling that defines the direction in which the content is flowing.
  // Also makes it easier to stretch the lists to the height of the screen later on.
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;

  // Ensure that the board covers the viewport and add some padding to make it look better.
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;

  // Only allow horizontal scrolling.
  overflow-x: auto;
  overflow-y: hidden;
}
```

Finally, we need to add a little bit of CSS to the board's container, in order to prevent it from
pushing the toolbar up and to stop it from stretching out the container once it has more content.

`drawer.component.scss`
```scss
.mat-toolbar.mat-primary {
  ...

  // Prevent the toolbar from shrinking.
  flex-shrink: 0;
}

.mat-sidenav-content {
  // Contain the board within its container.
  display: flex;
  flex-direction: column;
}
```

### List
The list will be a single element that is made up of a header and a scrollable section that can
contain an unknown amount of cards. If the cards can't fit in the viewport, the list will become
scrollable. Firstly, we'll add our markup and we'll hook it up to our data.

`app.component.html`
```html
<ng-trello-drawer>
  <div class="board">
    <div class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
      <h2 class="mat-h2">{{track.title}}</h2>
    </div>
  </div>
</ng-trello-drawer>
```

Note the `mat-elevation-z1` and `mat-h2` CSS classes above. These are utility classes from Angular
Material that allow us to quickly set an elevation `box-shadow` on the card list and to style the
header according to the Material Design guidelines.

Once we've got our markup, we can move on to styling it:
`app.component.scss`
```scss
.card-list {
  // Stretch the element to the height of the board and make it scrollable.
  height: 100%;
  width: 320px;
  overflow: auto;
  box-sizing: border-box;
  margin-right: 8px;
  flex-shrink: 0;

  // Some extra styling to make the card list look better.
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 8px;
}
```

### Card
Now that we have our board and list set up, we can move on to the individual cards. Since the card
will have some logic associated with it, we'll turn it into a reusable component. First we'll create
the following empty files that we'll need later:

* `./src/app/card/card.component.ts`
* `./src/app/card/card.component.html`
* `./src/app/card/card.component.scss`

In the `card.component.ts` we'll declare our component, which will have inputs for the card's
`text`, `author`, `tags` and `image`.

`card.component.ts`
```ts
import { Component, Input } from '@angular/core';

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
}
```

We also have to remember to add the card to the `AppModule`.

`app.module.ts`
```ts
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    ...
    CardComponent
  ]
})
export class AppModule { }
```

Once we've got the base for the component, we can add it to our board view so that we can see
what the data looks like as we're styling it.

`app.component.html`
```html
<ng-trello-drawer>
  <div class="board">
    <div class="card-list mat-elevation-z1" *ngFor="let track of board.tracks">
      <h2 class="mat-h2">{{track.title}}</h2>
      <ng-trello-card
        *ngFor="let talk of track.talks"
        [text]="talk.text"
        [tags]="talk.tags"
        [author]="talk.speaker"
        [image]="talk.image"></ng-trello-card>
    </div>
  </div>
</ng-trello-drawer>
```

Our card will consist of a few Angular Material components, as well as some custom styling. We'll
use a `mat-card` to render out the card itself, a `mat-chip-list` to show the tags and a
`mat-button` for the buttons.

`card.component.html`
```html
<mat-card>
  <!-- mat-card allows us to optionally provide a card image. -->
  <img *ngIf="image" mat-card-image [src]="image">

  <!-- Use the mat-card-content to add the proper spacing. -->
  <mat-card-content>
    {{text}}

    <div *ngIf="tags">
      <!--
        Render out the tags as a list of chips. Note that we want
        readonly chips so we `selectable` to `false`.
      -->
      <mat-chip-list>
        <mat-chip *ngFor="let tag of tags" selectable="false">{{tag}}</mat-chip>
      </mat-chip-list>
    </div>
  </mat-card-content>

  <!-- Section for buttons and the talk author. -->
  <mat-card-actions>
    <div class="author" *ngIf="author">By: {{author}}</div>
    <button mat-button>EDIT</button>
  </mat-card-actions>
</mat-card>
```

If you're following along in your IDE, you might get some errors at this pont, because we haven't
imported the required Angular Material modules for the components that we're using. We'll fix the
errors by adding import the `MatCardModule` and `MatChipsModule` into our `AppModule`.

`app.module.ts`
```ts
import { MatCardModule, MatChipsModule } from '@angular/material';

@NgModule({
  imports: [
    ...
    MatCardModule,
    MatChipsModule,
  ]
})
export class AppModule { }

```

At this point you may notice that while the app compiles, the card doesn't look great, because some
of the spacings are off. We'll use a few custom CSS styles to override the Material styling and
make it work for our use case.

`card.component.scss`
```scss
// Our custom element will be `display: inline` by default. Make it a block and add some spacing.
:host {
  display: block;
  margin-bottom: 8px;
}

// Remove Material's margin from the content since we have a row of chips.
.mat-card-content {
  margin-bottom: 0;
}

// Spread out the actions content to the left and right.
.mat-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Add some spacing to the chip list
.mat-chip-list {
  display: block;
  margin-top: 12px;
}

// Allows for the image to cover the card while preserving its dimensions.
.mat-card-image {
  object-fit: cover;
  object-position: top;
  max-height: 150px;
}

// Increase the size of the author's name and add some spacing.
.author {
  font-size: 14px;
  margin-left: 8px;
}
```

Now that our board is starting to take shape, we'll top things off by allowing users to switch
between boards. To do so we need to expose the data in the `DrawerComponent` and to add an
`activate` method which will change the current board.

`drawer.component.ts`
```ts
import { BoardService, Board } from '../data.service';

@Component()
export class DrawerComponent {
  ...

  boards: Board[];

  constructor(private breakpointObserver: BreakpointObserver,
              private boardService: BoardService) {
    this.boards = boardService.getBoards();
  }

  get currentBoard() {
    return this.boardService.currentBoard;
  }

  activate(board: Board) {
    this.boardService.currentBoard = board;
  }
}
```

Finally, we can swap out the dummy links with buttons that will change the current board. We can
take it a step further by showing the name of the current board in the toolbar.

`drawer.component.html`
```html
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav>
    ...
    <mat-nav-list>
      <!-- Show the list of boards and allow users to switch between them. -->
      <a mat-list-item
        (click)="activate(board)"
        *ngFor="let board of boards">{{board.title}}</a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <mat-toolbar color="primary">
      ...
      <!-- Show the current board name. -->
      <span>{{currentBoard.title}}</span>
    </mat-toolbar>

    <ng-content></ng-content>
  </mat-sidenav-content>
</mat-sidenav-container>
```

[Continue to the next step](./step-5.md)
