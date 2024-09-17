"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  const { ExtensionSupport } = ChromeUtils.importESModule(
    "resource:///modules/ExtensionSupport.sys.mjs"
  );

  // This example loads a system module with additional code. The file can only
  // be loaded after a custom resource:// url has been registered. This example
  // is using the LegacyHelper API to register the resource:// url. The following
  // call will fail, if that resource url has not yet been defined.
  // Note: System modules cannot be unloaded. To use the new module implementation
  //       after a reload or update, a unique string is appended as a query, to
  //       never use a cached version of the module.
  const { TestModule } = ChromeUtils.importESModule(
    "resource://exampleaddon1234/TestModule.sys.mjs?" + Date.now()
  )

  // An EventEmitter has the following basic functions:
  // * EventEmitter.on(emitterName, callback): Registers a callback for a
  //   custom emitter.
  // * EventEmitter.off(emitterName, callback): Unregisters a callback for a
  //   custom emitter.
  // * EventEmitter.emit(emitterName, ...args): Emit a custom emitter, all
  //   provided args will be forwarded to the registered callbacks.
  const emitter = new ExtensionCommon.EventEmitter();

  // This is the important part. It implements the functions and events defined
  // in the schema.json. The name must match what you've been using so far,
  // "ActivityManager" in this case.
  class ActivityManager extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        // This key must match the class name.
        ActivityManager: {
          registerWindowListener() {
            // Register a listener for newly opened activity windows. This calls a
            // function of our TestModule.
            ExtensionSupport.registerWindowListener(context.extension.id, {
              chromeURLs: [
                "chrome://messenger/content/activity.xhtml",
              ],
              onLoadWindow(window) {
                TestModule.onLoad(window, context.extension, emitter);
              },
            });
          },
          
          onCommand: new ExtensionCommon.EventManager({
            context,
            name: "ActivityManager.onCommand",
            register(fire) {
              function callback(event, x, y) {
                // Let the event return the coordinates of the click.
                return fire.async(x, y);
              }

              emitter.on("activity-manager-clear", callback);
              return function () {
                emitter.off("activity-manager-clear", callback);
              };
            },
          }).api(),
        },
      };
    }

    onShutdown(isAppShutdown) {
      // This function is called if the extension is disabled or removed, or
      // Thunderbird closes. We usually do not have to do any cleanup, if
      // Thunderbird is shutting down entirely.
      if (isAppShutdown) {
        return;
      }

      // Remove our manipulations of the activity monitor. This calls a function
      // of our TestModule.
      const { extension } = this;
      for (let window of ExtensionSupport.openWindows) {
        if ([
          "chrome://messenger/content/activity.xhtml",
        ].includes(window.location.href)) {
          TestModule.onUnload(window, extension)
        }
      }

      // Unregister our listener for newly opened windows.
      ExtensionSupport.unregisterWindowListener(extension.id);

      console.log("Good Bye!")
    }
  };

  // Export the API by assigning it to the exports parameter of the anonymous
  // closure function, which is the global this.
  exports.ActivityManager = ActivityManager;

})(this)
