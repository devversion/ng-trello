#### Quick Jump ####
* [Step 1](./step-1.md)
* [Step 2](./step-2.md)
* **Step 3**
* [Step 4](./step-4.md)
* [Step 5](./step-4.md)
* [Step 6](./step-6.md)
* [Step 7](./step-7.md)
* [Step 8](./step-8.md)
* [Step 9](./step-9.md)
* [Step 10](./step-10.md)

## Step 3 task:

In this step we're going to set up the data model for our app, as well as a service with some
dummy data that we're going to render out in the Trello board in the next step.

First of all, we're going to create a file with our dummy data which we'll expose through the
service. We've prepared a JSON file that contains the AngularConnect schedule in the form of
a Trello board which you can paste into your project. To get started, create an empty file
under `./src/app/data.json` and
[add the dummy data from here](https://github.com/DevVersion/ng-trello/blob/master/src/app/data.json).

Now that we have our data, we can start working on our service. First we have to create a empty
file under `./src/app/data.service.ts` in which we'll have our service, as well as the interfaces
that describe the dummy data. We know that our data consists of multiple talks, where each `Talk`
belongs to a track and the `Track` is part of a `Board` which represents a day of AngularConnect.
The data can be represented with the following interfaces:

```ts
export interface Talk {
  text: string;
  speaker?: string;
  tags?: string[];
  image?: string;
}

export interface Track {
  title: string;
  talks: Talk[];
}

export interface Board {
  title: string;
  tracks: Track[];
}
```

After we've set up our types, we can add a service that will expose the data. Our service will be
very simple since we're loading the dummy data from a JSON file, but you can use this as a starting
point if you want to load it from a backend. We only need a `getBoards` method which the view will
use to display the boards, as well as a private `_boards` property which will hold all the data.

```ts
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BoardService {
  private _boards: Board[];

   getBoards(): Board[] {
    return this._boards;
  }
}
```

Note the `providedIn: 'root'` that we've added to our `Injectable`, which will ensure that the
service will be shared globally across the entire app.

Once we've got the service, we need to load in the data. This is as simple as adding a `require`
call that imports the `data.json` file from earlier. Note that if you're following along in
your IDE, TypeScript might complain about `require`. You can fix the error by adding `"node"` to
the `types` array in the `tsconfig.app.json` file.

```ts
@Injectable({providedIn: 'root'})
export class BoardService {
  private _boards: Board[] = require('./data.json');
}
```

Finally, we have to expose our service to the rest of the app by adding it to the `providers` array
in the `./src/app/app.module.ts`:

```ts
import { BoardService } from './data.service';

@NgModule({
  ...
  providers: [BoardService]
})
export class AppModule { }
```

[Continue to the next step](./step-4.md)
