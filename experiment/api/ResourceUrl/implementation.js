/*
 * This file is provided by the addon-developer-support repository at
 * https://github.com/thundernest/addon-developer-support
 *
 * Version 1.0
 * - initial release
 *
 * Authors:
 * - John Bieling (john@thunderbird.net)
 * - Arnd Issler (email@arndissler.net)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

(function (exports) {

  // Import some things we need.
  var { ExtensionCommon } = ChromeUtils.import(
    "resource://gre/modules/ExtensionCommon.jsm"
  );
  var { ExtensionUtils } = ChromeUtils.import(
    "resource://gre/modules/ExtensionUtils.jsm"
  );
  var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
  var { ExtensionError } = ExtensionUtils;

  let resourceUrls = new Set();

  class ResourceUrl extends ExtensionCommon.ExtensionAPI {
    // The API implementation.
    getAPI(context) {
      return {
        ResourceUrl: {
          register(namespace, folder) {
            const resProto = Cc[
              "@mozilla.org/network/protocol;1?name=resource"
            ].getService(Ci.nsISubstitutingProtocolHandler);

            if (resProto.hasSubstitution(namespace)) {
              throw new ExtensionError(`There is already a resource:// url for the namespace "${namespace}"`);
            }
            let uri = Services.io.newURI(
              folder || ".",
              null,
              context.extension.rootURI
            );
            resProto.setSubstitutionWithFlags(
              namespace,
              uri,
              resProto.ALLOW_CONTENT_ACCESS
            );
            resourceUrls.add(namespace);
          }
        }
      };
    }

    onShutdown(isAppShutdown) {
      if (isAppShutdown) {
        return; // the application gets unloaded anyway
      }

      // Unload JSMs of this add-on
      for (let module of Cu.loadedModules) {
        let [schema, , namespace] = module.split("/");
        if (schema == "resource:" && resourceUrls.has(namespace)) {
          console.log("Unloading module", module);
          Cu.unload(module);
        }
      }

      // Flush all caches
      Services.obs.notifyObservers(null, "startupcache-invalidate");

      const resProto = Cc[
        "@mozilla.org/network/protocol;1?name=resource"
      ].getService(Ci.nsISubstitutingProtocolHandler);

      resourceUrls.forEach(namespace => {
        console.log("Unloading namespace", namespace);
        resProto.setSubstitution(namespace, null);
      });
    }
  }

  exports.ResourceUrl = ResourceUrl;
})(this);
