"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  const { ExtensionSupport } = ChromeUtils.importESModule(
    "resource:///modules/ExtensionSupport.sys.mjs"
  );

  // This example loads a JSM file with additional code. Recent versions of
  // Thunderbird have moved to modern ES6 system modules. However, these cannot
  // be used by extensions, because they cannot be unloaded. Unloading modules is
  // crucial for extension to read updated implementations after an add-on update.
  // Since support for JSM files will be dropped, its usage should be removed entirely.
  
  // The JSM file can only be loaded after a custom resource:// url has been
  // registered. Since we need the extension object, we cannot do that here
  // directly, but in startup().
  let TestModule;

  // Class to manage custom resource:// urls.
  class ResourceUrl {
    constructor() {
      this.customNamespaces = [];
    }
    
    register(customNamespace, extension, folder) {
      const resProto = Cc[
        "@mozilla.org/network/protocol;1?name=resource"
      ].getService(Ci.nsISubstitutingProtocolHandler);

      if (customNamespace != customNamespace.toLowerCase()) {
        throw new ExtensionError(`The namespace is invalid, it must be written entirely in lowercase letters: "${customNamespace}"`);
      };

      customNamespace != customNamespace.toLowerCase()

      if (resProto.hasSubstitution(customNamespace)) {
        throw new ExtensionError(`There is already a resource:// url for the namespace "${customNamespace}"`);
      }
      this.customNamespaces.push(customNamespace);

      let uri = Services.io.newURI(
        folder || ".",
        null,
        extension.rootURI
      );
      resProto.setSubstitutionWithFlags(
        customNamespace,
        uri,
        resProto.ALLOW_CONTENT_ACCESS
      );
    }

    unloadModules() {
      for (let module of Cu.loadedModules) {
        let [schema, , namespace] = module.split("/");
        if (
          schema == "resource:" && 
          this.customNamespaces.includes(namespace.toLowerCase())
        ) {
          console.log("Unloading module", module);
          Cu.unload(module);
        }
      }
    }
    
    unregister() {
      const resProto = Cc[
        "@mozilla.org/network/protocol;1?name=resource"
      ].getService(Ci.nsISubstitutingProtocolHandler);
      for (let customNamespace of this.customNamespaces) {
        console.log("Unloading namespace", customNamespace);
        resProto.setSubstitution(customNamespace, null);
      }
    }
  }
  const resourceUrl = new ResourceUrl();

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

    onStartup() {
      const { extension } = this;
      
      // Register a resource:// url which points to the module folder. The name
      // should be unique to avoid conflicts with other add-ons. The name must be
      // written entirely in lowercase letters.
      resourceUrl.register("exampleaddon1234", extension, "modules/");
  
      // Load our own TestModule. Since TestModule is not defined here, outer
      // parentheses are required. See
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#assignment_separate_from_declaration_2
      ({TestModule} = ChromeUtils.import(
        "resource://exampleaddon1234/TestModule.jsm"
      ))
      
      // Register a listener for newly opened activity windows. This calls a
      // function of our TestModule.
      ExtensionSupport.registerWindowListener(extension.id, {
        chromeURLs: [
          "chrome://messenger/content/activity.xhtml",
        ],
        onLoadWindow (window) {
          TestModule.onLoad(window, extension, emitter);
        },
      });
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

      // Unload all modules which have been loaded with our resource:// url.
      resourceUrl.unloadModules();

      // Unregister all our resource:// urls.
      resourceUrl.unregister();

      // Flush all caches.
      Services.obs.notifyObservers(null, "startupcache-invalidate");

      console.log("Good Bye!")
    }
  };

  // Export the api by assigning it to the exports parameter of the anonymous
  // closure function, which is the global this.
  exports.ActivityManager = ActivityManager;

})(this)
