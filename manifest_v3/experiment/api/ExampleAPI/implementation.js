/* eslint-disable object-shorthand */

"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  // The resource url used here is defined in our background script. To be sure it
  // has been successfully registered, we use the background to first register the
  // url and then call a method of this API. Using onStartup events can break this
  // desired order, because the API will be loaded directly and not when first used
  // in the background.
  var { myModule } = ChromeUtils.import("resource://exampleapi/myModule.jsm");

  // Get various parts of the WebExtension framework that we need.
  var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");

  // You probably already know what this does.
  var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

  // A helpful class for listening to windows opening and closing.
  var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");

  /**
   * This object is just what we're using to listen for toolbar clicks. The implementation
   * isn't what this example is about, but you might be interested as it's a common pattern.
   * We count the number of callbacks waiting for events so that we're only listening if we
   * need to be.
   * 
   * An EventEmitter has the following basic functions:
   * 
   * EventEmitter.on(emitterName, callback)
   *   Registers a callback for a custom emitter.
   * 
   * EventEmitter.off(emitterName, callback)
   *   Unregisters a callback for a custom emitter.
   * 
   * EventEmitter.emit(emitterName)
   *   Emit a custom emitter, all provided parameters will be forwarded to the registered callbacks.
   */

  let windowListener;

  class WindowListener extends ExtensionCommon.EventEmitter {
    constructor(extension) {
      super();
      this.extension = extension;
      this.callbackCount = 0;
    }

    get listenerId() {
      return `experiment_listener_${this.extension.uuid}_${this.extension.instanceId}`;
    }

    handleEvent(event) {
      // Only react to the secondary mouse button.
      if (event.button == 2) {
        let toolbar = event.target.closest("toolbar");
        // Emit "toolbar-clicked" and send toolbar.id, event.clientX, event.clientY to
        // the registered callbacks.
        windowListener.emit("toolbar-clicked", toolbar.id, event.clientX, event.clientY);
      }
    }

    add(callback) {
      // Registering the callback for "toolbar-clicked".
      this.on("toolbar-clicked", callback);
      this.callbackCount++;

      if (this.callbackCount == 1) {
        ExtensionSupport.registerWindowListener(this.listenerId, {
          chromeURLs: [
            "chrome://messenger/content/messenger.xhtml",
            "chrome://messenger/content/messenger.xul",
          ],
          onLoadWindow: function (window) {
            let toolbox = window.document.getElementById("mail-toolbox");
            toolbox.addEventListener("click", windowListener.handleEvent);
          },
        });
      }
    }

    remove(callback) {
      // Un-Registering the callback for "toolbar-clicked".
      this.off("toolbar-clicked", callback);
      this.callbackCount--;

      if (this.callbackCount == 0) {
        for (let window of ExtensionSupport.openWindows) {
          if ([
            "chrome://messenger/content/messenger.xhtml",
            "chrome://messenger/content/messenger.xul",
          ].includes(window.location.href)) {
            let toolbox = window.document.getElementById("mail-toolbox");
            toolbox.removeEventListener("click", this.handleEvent);
          }
        }
        ExtensionSupport.unregisterWindowListener(this.listenerId);
      }
    }
  };


  // This is the important part. It implements the functions and events defined
  // in the schema.json. The name must match what you've been using so far,
  // "ExampleAPI" in this case.
  // For manifest v3, the used class must be ExtensionAPIPersistent(), otherwise
  // its events are not registered as being persistent and will fail to wake up
  // the background. 
  class ExampleAPI extends ExtensionCommon.ExtensionAPIPersistent {
    // An alternative to defining a constructor here, is to use the onStartup
    // event. However, this causes the API to be instantiated directly after the
    // add-on has been loaded, not when the API is first used. Depends on what is
    // desired.
    constructor(extension) {
      super(extension);
      windowListener = new WindowListener(extension);
    }

    PERSISTENT_EVENTS = {
      // For primed persistent events (deactivated background), the context is
      // only available after fire.wakeup() has fulfilled (ensuring the convert()
      // function has been called).

      onToolbarClick({ context, fire }) {
        const { extension } = this;

        // In this function we add listeners for any events we want to listen to,
        // and return a function that removes those listeners. To have the event
        // fire in your extension, call fire.async.
        async function callback(event, id, x, y) {
          if (fire.wakeup) {
            await fire.wakeup();
          }
          return fire.async(id, x, y);
        }
        windowListener.add(callback);

        return {
          unregister: () => {
            windowListener.remove(callback);
          },
          convert(newFire, extContext) {
            fire = newFire;
            context = extContext;
          },
        };
      }
    }

    getAPI(context) {
      return {
        // Again, this key must have the same name.
        ExampleAPI: {

          // A function.
          sayHello: async function (name) {
            myModule.incValue();
            Services.wm.getMostRecentWindow("mail:3pane").alert("Hello " + name + "! I counted <" + myModule.getValue() + "> clicks so far.");
          },

          // A persistent event. Most of this is boilerplate you don't need to
          // worry about, just copy it. The actual implementation is inside the
          // PERSISTENT_EVENTS object.
          onToolbarClick: new ExtensionCommon.EventManager({
            context,
            module: "ExampleAPI",
            event: "onToolbarClick",
            extensionApi: this,
          }).api(),
        },
      };
    }

    onShutdown(isAppShutdown) {
      // This function is called if the extension is disabled or removed, or Thunderbird closes.
      // We usually do not have to do any cleanup, if Thunderbird is shutting down entirely
      if (isAppShutdown) {
        return;
      }

      // Unloading of our JSM module is done by the PrivilegedUrl API, so we do not do that here.
      console.log("Goodbye world!");
    }
  };

  // Export the api by assigning in to the exports parameter of the anonymous closure
  // function, which is the global this.
  exports.ExampleAPI = ExampleAPI;

})(this)
