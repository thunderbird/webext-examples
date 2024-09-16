"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  const aomStartup = Cc[
    "@mozilla.org/addons/addon-manager-startup;1"
  ].getService(Ci.amIAddonManagerStartup);
  const resProto = Cc[
    "@mozilla.org/network/protocol;1?name=resource"
  ].getService(Ci.nsISubstitutingProtocolHandler);

  const chromeHandlers = [];
  const resourceUrls = [];

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
                    resourceUrls.push(entry[1]);
                  }
                  break;

                case "content":
                case "locale":
                  {
                    let handle = aomStartup.registerChrome(
                      manifestURI,
                      [entry]
                    );
                    chromeHandlers.push(handle);
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
      if (isAppShutdown) {
        return; // the application gets unloaded anyway
      }

      for (let chromeHandler of chromeHandlers) {
        if (chromeHandler) {
          chromeHandler.destruct();
          chromeHandler = null;
        }
      }

      for (let resourceUrl of resourceUrls) {
        resProto.setSubstitution(
          resourceUrl,
          null
        );
      }

      // Flush all caches.
      Services.obs.notifyObservers(null, "startupcache-invalidate");
    }
  };
  exports.LegacyHelper = LegacyHelper;
})(this);