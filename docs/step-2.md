#### Quick Jump ####
* [Step 1](./step_1.md)
* **Step 2**
* [Step 3](./step_3.md)
* [Step 4](./step_4.md)
* [Step 5](./step_5.md)
* [Step 6](./step_6.md)
* [Step 6](./step_7.md)
* [Step 8](./step_8.md)
* [Step 9](./step_9.md)
* [Step 10](./step_10.md)

## Step 2 task:

In this step we're going to set up our initial layout by adding a Material Design `drawer`, which is also known
as a `sidenav` in Angular Material. The drawer will be provide a way for users to switch between different pages. 
In our case there are no real pages yet, but we will talk about the `sidenav` links in the upcoming steps.

In order to start with a simple `sidenav` that also comes with a Material Design app bar, which is also known as
`toolbar`, we can either use an Angular Material schematic, or create the layout on our own.

For those who want to use the Angular CLI. Yust run the following command in the project:

```bash
ng generate @angular/material:nav drawer
```

This generates a simple navigation layout consisting of a `drawer` and a toolbar. Note that the schematic also 
created logic to automatically show the `drawer` in a responsive way. For this, the schematic takes advantage of
the `@angular/cdk/layout` utility.

---

Doing it manually is more time consuming, but helps you developing a feeling for Angular Material components and the
Angular component devkit.

First, we need to create a new component that includes the `drawer` and `toolbar`. Therefore you need to create the
following files:

* `src/app/drawer/drawer.component.ts`
* `src/app/drawer/drawer.component.html`
* `src/app/drawer/drawer.component.scss`

Within the TypeScript file, we create a new empty `Component` by adding the following code:

`src/app/drawer/drawer.component.ts`
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'ng-trello-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {}
```

Now, since we've also referenced the associated `.html` and `.scss` files in the component, we should create the
template for the `DrawerComponent`.

`src/app/drawer/drawer.component.html`
```html
<mat-sidenav-container class="sidenav-container">

  <mat-sidenav #drawer class="sidenav" fixedInViewport="true">
    <mat-toolbar>Menu</mat-toolbar>
    <mat-nav-list>
      <a mat-list-item href="#">Link 1</a>
      <a mat-list-item href="#">Link 2</a>
      <a mat-list-item href="#">Link 3</a>
    </mat-nav-list>
  </mat-sidenav>
  
  <!--
   This is the content that will be shown next to the sidenav. Angular Material somehow needs to
   group the content within an element because a sidenav can also "push" the content horizontally.
  -->
  
  <mat-sidenav-content>
  
    <!--
      This is the primary toolbar that shows at the top of the content. It includes a button to toggle the sidenav,
      and the title of the application.
    -->
  
    <mat-toolbar color="primary">
      <button
          type="button"
          aria-label="Toggle sidenav"
          mat-icon-button
          (click)="drawer.toggle()">
        <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
      </button>
      
      <span>Angular Trello</span>
    </mat-toolbar>
    
    <!-- 
      Since we want to make the drawer component independent to the actual application content, we just
      render the content that has been projected. 
    -->
    
    <ng-content></ng-content>
     
   </mat-sidenav-content>
</mat-sidenav-container>
```

Once we've set up the template for the new component, we can also add some custom styles in favor of making
our app look better.

`src/app/drawer/drawer.component.scss`
```scss
// The sidenav container should take the whole height. This does not prevent scrolling because
// the content should scroll inside of the `<mat-sidenav-content>`.
.sidenav-container {
  height: 100%;
}

 .sidenav {
  width: 200px;
}

// We want the toolbar in the sidenav to blend with the actual background.
 .sidenav .mat-toolbar {
  background: inherit;
}

// Our app toolbar should be sticky and therefore always visible to the user.
 .mat-toolbar.mat-primary {
  position: sticky;
  top: 0;
  z-index: 1;
}
```

Finally we've finished writing the code for our initial drawer component. Nevertheless, in order to be able to
display it, we still need to:
 
 * Import the given Angular Material `NgModule`'s in our app module
 * Add the newly added component to the `NgModule` declarations.
 * Use the new `<ng-trello-drawer>` component in our app. 

`src/app/app.module.ts`
```ts
import { DrawerComponent } from './drawer/drawer.component';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';

@NgModule({
  declarations: [
    ...
    DrawerComponent
  ],
  imports: [
    ...
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
```

`src/app/app.component.html`
```html
<ng-trello-drawer>
  My content
</ng-trello-drawer>
```

At this point, this step is technically already finished, but practically it does not fulfil our good UX-expectations
in case someone visits the app with bigger or smaller devices.

  1) On bigger screens, the `sidenav` can be always shown next to the content
  2) On smaller screens, the `sidenav` should be hidden by default, but still openable through the button.

We can improve this user experience by using the `@angular/cdk/layout` utility that allows us to react on changes
to the viewport size.

First of all, add the `LayoutModule` from the CDK to the app module.

`src/app/app.module.ts`
```ts
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  ...
  imports: [
    ...
    LayoutModule,
  ],
```

Now that we have imported the CDK layout utilities, we can start using them in our `DrawerComponent` to construct
an observable that emits whether the screen size is for a `Handset`. We can use the observable to dynamically
switch between the different modes of our sidenav. 

`src/app/drawer/drawer.component.ts`
```ts
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

...
export class DrawerComponent {
  
  /**
   * Constuct an observable that emits "true" if the current screen size matches the "Handset"
   * breakpoint. The default breakpoints are matching the Material Design guidelines.
   * Read more: https://material.io/design/layout/responsive-layout-grid.html#grid-customization
   */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
    
  constructor(private breakpointObserver: BreakpointObserver) {}
 }
```

Once we have our `isHandset` observable set up, we can integrate it into our `HTML` template.

`src/app/drawer/drawer.component.html`
```html
  <!-- 
   There are a few things we want to dynamically change if we are on a handset device:
      
      1) If we are on a handset device, the sidenav **overlaps** the content
      2) If we aren't on a handset device, the sidenav should be **always** opened. 
  -->

  <mat-sidenav ...
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="!(isHandset$ | async)">
      
  ...
      
  <mat-sidenav-content>
    <mat-toolbar color="primary">
      <!-- 
        Since the sidenav is **always** opened on non-handset devices, we only want to show the toggle
        button if we are on a handset device.
      -->  
      <button ...
        *ngIf="isHandset$ | async">
``` 
