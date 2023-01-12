## Experiment API

This extension shows how to write an Experiment API including a function and a persistent manifest v3 event. It also shows how to listen to custom events and how to load custom JSM files.

For more information, check out the [documentation](https://thunderbird-webextensions.readthedocs.io/en/latest/how-to/experiments.html).

### Required changes for manifest v3

The event listener registration was moved to the top level file scope, so it is
registered as persistent and can wake up the background.

The implementation of the `ExampleAPI` Experiment had to be updated to support
persistent events.

**Note:** It is currently not possible to distinguish an add-on enable from a 
background restart. The used ResourceUrl Experiment therefore throws an error,
since it tries to re-register the url.
