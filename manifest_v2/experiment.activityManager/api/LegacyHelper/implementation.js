"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  const aomStartup = Cc[
    "@mozilla.org/addons/addon-manager-startup;1"
  ].getService(Ci.amIAddonManagerStartup);
  const resProto = Cc[
    "@mozilla.org/network/protocol;1?name=resource"
  ].getService(Ci.nsISubstitutingProtocolHandler);

  var LegacyHelper = class extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        LegacyHelper: {
          registerGlobalUrls(data) {
            const manifestURI = Services.io.newURI(
              "manifest.json",
              null,
              context.extension.rootURI
            );

            for (let entry of data) {
              // [ "resource", "shortname" , "path" ]

              switch (entry[0]) {
                case "resource":
                  {
                    let uri = Services.io.newURI(
                      entry[2],
                      null,
                      context.extension.rootURI
                    );
                    resProto.setSubstitutionWithFlags(
                      entry[1],
                      uri,
                      resProto.ALLOW_CONTENT_ACCESS
                    );
                  }
                  break;

                case "content":
                case "locale":
                  {
                    let handle = aomStartup.registerChrome(
                      manifestURI,
                      [entry]
                    );
                  }
                  break;
                
                default:
                  console.warn(`LegacyHelper: Unsupported url type: ${entry[0]}`)
              } 
            }
          },

          openDialog(name, path) {
            let window = Services.wm.getMostRecentWindow("mail:3pane");
            window.openDialog(
              path,
              name,
              "chrome,resizable,centerscreen"
            );
          },
        },
      };
    }

    onShutdown(isAppShutdown) {
      // This API intentionally does not unregister any of the registered global
      // urls. If other Experiment APIs use these registered urls, they could run
      // into race conditions during shutdown: the order in which Experiments are
      // unloaded is the same order in which they have been loaded, so this
      // Experiment is mostly unloaded before all others.
      
      // Furthermore it is no longer possible to unload system modules, the accepted
      // approach is to append a unique identifier as a query when specifying the
      // module path:
      // var { TestModule } = ChromeUtils.importESModule(
      //  "resource://example123/TestModule.sys.mjs?" + Date.now()
      // );

      // We have not observed any negative side effects of not un-registering
      // global urls, they are overwritten the next time they are registered.

      // Flush all caches.
      Services.obs.notifyObservers(null, "startupcache-invalidate");
    }
  };
  exports.LegacyHelper = LegacyHelper;
})(this);