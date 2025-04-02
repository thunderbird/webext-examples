
This add-on is an example of using:
* [Vue](https://vuejs.org/), [Vite](https://vite.dev/) and [TypeScript](https://www.typescriptlang.org/)
* one of the [Experiments APIs](https://github.com/thunderbird/webext-support/tree/master/experiments/FileSystem)

Specifically, the add-on presents a popup window with two buttons.
* One button to write a "hello" message with the current timestamp to a new file in the user's profile directory.
* A second button to read the contents of that file

In order to see the results, make sure to have either Error Console or Dev Tools open.

## Getting started

You will need to [install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) (v20+).

You can use `npm`, `pnpm`, or `yarn`.

Then:
- `cd typescript-vue-experiment-api`
- and install this project's dependencies: `npm i`

## Compiling the add-on

To compile the project:

```sh
npm run build
```
### Optional: Rebuild on file change

Alternatively, if you are using Linux, macOS, or WSL you can automatically rebuild the add-on when a `.vue`, `.js`, `.ts`, or `.json` file changes:
```sh
# Make sure to install this first: https://github.com/eradman/entr
npm run watch
```

## Loading the add-on

After compilation finishes, go to Thunderbird's "Debugging - Runtime" window and click "Load Temporary Add-on..".

Choose the `manifest.json` file in the `dist` directory.


## Notes

* The addon-on will only run in Thunderbird (v128+)
* The `watch` script relies on [entr](https://github.com/eradman/entr).

## Additional information

### `src/background.ts`

The `manifest.json` specifies "background.js" as the background script. This file is not part of the repo; it is compiled from `src/background.ts`

The `background.ts` script does the following:
- Opens the Vue application in a popup window
- Listens for messages from the Vue application

Essentially, it acts as a "server", allowing the Vue application to focus on user interaction and styling.

### `src/App.vue`

This is the core of the Vue application. (Like any Vue application, you can add additional components and then import them into `App.vue`.)

It uses the `sendMessage` function from `utils.ts` to send messages to `background.ts`. It can also receive responses from `background.ts`.

For example, the `readFile` function sends a message and `await`s the response:

```ts
async function readFile() {
  const contents = await sendMessage({ action: ACTIONS.READ });
  console.log(`[readFile] read contents: ${contents}`);
}
```

Here is the corresponding code from `background.ts`. The `return` value is used as the response.
```ts
if (request.action === ACTIONS.READ) {
  // @ts-ignore
  const contents = await browser.FileSystem.readFile("test123.txt");
  return contents;
}
```

(The `// @ts-ignore` is necessary since `FileSystem` isn't a standard property of the global `browser` (or `messenger`) object. It was added by the `experiment_apis` declared in the `manifest.json`.)


### `vite.config.*` and `build.sh`

There are two `vite` configuration files. The Vue app and the background script are treated as two different compilation targets.

The `build.sh` script runs `vite build` once for each of these targets.

## Bugs

* The source map for `background.ts` does not load properly at this time.
