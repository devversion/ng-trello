#### Quick Jump ####
* **Step 1**
* [Step 2](./step_2.md)
* [Step 3](./step_3.md)
* [Step 4](./step_4.md)
* [Step 5](./step_4.md)
* [Step 6](./step_6.md)
* [Step 7](./step_7.md)
* [Step 8](./step_8.md)
* [Step 9](./step_9.md)
* [Step 10](./step_10.md)

## Step 1 task:

Before we can play with Angular Material and the Angular CDK, we need to install
the required dependencies for our new Angular CLI project.

Previously you'd have done all of the setup steps manually and potentially might miss
some of the options that are available when setting up a Material project. Now with the
`ng add` command, the whole step is a single command that needs to be run.

```bash
ng add @angular/material
```

Since our `ng-add` schematic supports CLI prompts, you have to specify a few of the
available options in order to complete the setup.

1) Select whatever theme you want to use in our workshop. You are free to choose!
   
   <img src="https://user-images.githubusercontent.com/4987015/47778651-9df65700-dcf7-11e8-8a29-7b31c060a1c9.png" width="500">
   
2) Decide whether you want to use gestures with HammerJS. In our case we don't need it
   necessarily, but in favor of showcasing, we will add it.
   
   <img width="526" src="https://user-images.githubusercontent.com/4987015/47778911-3096f600-dcf8-11e8-8613-5ecc417eee1b.png">
   
3) Decide whether you want to use the `BrowserAnimationsModule` or _no_ animations at all.
   In this workshop we will be using animations.
   
   <img width="535" src="https://user-images.githubusercontent.com/4987015/47779147-b1ee8880-dcf8-11e8-9425-d279b869504c.png">


[Continue to the next step](./step_2.md)
