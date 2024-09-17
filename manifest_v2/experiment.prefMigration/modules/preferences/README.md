## About

Convenient wrapper functions to manager add-on preferences. Designed to specify default values directly inside the module file:

```
const DEFAULTS = {
    // Default preference values
    enableDebug: false
}

```

The module can be used as follows:

```
import * as prefs from "preferences.mjs"

async function printDebugStatus() {
  let debug = await prefs.getPref("enableDebug"); 
  console.log(debug);
}

await printDebugStatus(); // prints false
await prefs.setPref("enableDebug", true);
await printDebugStatus(); // prints true
await prefs.clearUserPref("enableDebug");
await printDebugStatus(); // prints false

let debug = await prefs.getUserPref("enableDebug")
console.log(debug); // prints null
```


