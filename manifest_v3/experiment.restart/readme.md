## Restart Experiment

This extension uses an Experiment to add a *Restart* entry to Thunderbird's *file menu* and a second Experiment to perform the restart.

### Differences from the version for manifest v2

The two used event listeners are are added inside an async function which is executed
during add-on startup. One of them was registered AFTER the first async `await`
had been encountered which caused this listener to not be registered as persistent.
It had to be moved before the first async `await`.

The implementation of the `LegacyMenu` Experiment had to be updated to support
persistent events. Additionally, its usage of 

```
context.callOnClose({
    close: () => { clearAllWindows(); }
});
```

had to be replaced by 

```
onShutdown(isAppShutdown) {
      if (isAppShutdown) {
        return; // the application gets unloaded anyway
      }
      clearAllWindows();
    }
```

as the `close()` function registered via `callOnClose()` will be called on
background termination as well.
