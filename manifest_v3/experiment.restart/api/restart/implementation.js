"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {
  // Helper function to inject a legacy XUL string into the DOM of Thunderbird.
  // All injected elements will get the data attribute "data-extension-injected"
  // set to the extension id, for easy removal.
  const injectElements = function (extension, window, xulString, debug = false) {
    function checkElements(stringOfIDs) {
      let arrayOfIDs = stringOfIDs.split(",").map((e) => e.trim());
      for (let id of arrayOfIDs) {
        let element = window.document.getElementById(id);
        if (element) {
          return element;
        }
      }
      return null;
    }

    function localize(entity) {
      let msg = entity.slice("__MSG_".length, -2);
      return extension.localeData.localizeMessage(msg);
    }

    function injectChildren(elements, container) {
      if (debug) console.log(elements);

      for (let i = 0; i < elements.length; i++) {
        if (
          elements[i].hasAttribute("insertafter") &&
          checkElements(elements[i].getAttribute("insertafter"))
        ) {
          let insertAfterElement = checkElements(
            elements[i].getAttribute("insertafter")
          );

          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": insertafter " +
              insertAfterElement.id
            );
          if (
            debug &&
            elements[i].id &&
            window.document.getElementById(elements[i].id)
          ) {
            console.error(
              "The id <" +
              elements[i].id +
              "> of the injected element already exists in the document!"
            );
          }
          elements[i].setAttribute("data-extension-injected", extension.id);
          insertAfterElement.parentNode.insertBefore(
            elements[i],
            insertAfterElement.nextSibling
          );
        } else if (
          elements[i].hasAttribute("insertbefore") &&
          checkElements(elements[i].getAttribute("insertbefore"))
        ) {
          let insertBeforeElement = checkElements(
            elements[i].getAttribute("insertbefore")
          );

          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": insertbefore " +
              insertBeforeElement.id
            );
          if (
            debug &&
            elements[i].id &&
            window.document.getElementById(elements[i].id)
          ) {
            console.error(
              "The id <" +
              elements[i].id +
              "> of the injected element already exists in the document!"
            );
          }
          elements[i].setAttribute("data-extension-injected", extension.id);
          insertBeforeElement.parentNode.insertBefore(
            elements[i],
            insertBeforeElement
          );
        } else if (
          elements[i].id &&
          window.document.getElementById(elements[i].id)
        ) {
          // existing container match, dive into recursively
          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              " is an existing container, injecting into " +
              elements[i].id
            );
          injectChildren(
            Array.from(elements[i].children),
            window.document.getElementById(elements[i].id)
          );
        } else {
          // append element to the current container
          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": append to " +
              container.id
            );
          elements[i].setAttribute("data-extension-injected", extension.id);
          container.appendChild(elements[i]);
        }
      }
    }

    if (debug) console.log("Injecting into root document:");
    let localizedXulString = xulString.replace(
      /__MSG_(.*?)__/g,
      localize
    );
    injectChildren(
      Array.from(
        window.MozXULElement.parseXULToFragment(localizedXulString, []).children
      ),
      window.document.documentElement
    );
  };

  // An EventEmitter has the following basic functions:
  // * EventEmitter.on(emitterName, callback): Registers a callback for a
  //   custom emitter.
  // * EventEmitter.off(emitterName, callback): Unregisters a callback for a
  //   custom emitter.
  // * EventEmitter.emit(emitterName, ...args): Emit a custom emitter, all
  //   provided args will be forwarded to the registered callbacks.
  const emitter = new ExtensionCommon.EventEmitter();

  var Restart = class extends ExtensionCommon.ExtensionAPIPersistent {
    PERSISTENT_EVENTS = {
      onCommand({ fire }) {
        const { extension } = this;
        function callback(event, window) {
          // Let the event return the windowId of the window where the menu
          // item was clicked.
          return fire.async(extension.windowManager.getWrapper(window).id);
        }
        emitter.on("menu-item-clicked", callback);
        return {
          unregister: () => {
            emitter.off("menu-item-clicked", callback);
          },
          convert(newFire) {
            fire = newFire;
          },
        };
        
      },
    }

    getAPI(context) {
      return {
        Restart: {
          execute() {
            Services.startup.quit(
              Services.startup.eForceQuit | Services.startup.eRestart
            );
          },

          addMenuEntry(windowId) {
            // Get the native window belonging to the specified windowId.
            let { window } = context.extension.windowManager.get(windowId);
            injectElements(context.extension, window, `
              <menuitem 
                id="menu_FileRestartItem"
                insertbefore="menu_FileQuitItem"
                label="Restart"/>
            `)
            window.document.getElementById("menu_FileRestartItem").addEventListener("click", (e) => {
              emitter.emit("menu-item-clicked", e.target.ownerGlobal);
            })
          },

          // An event to inform the WebExtension the restart menu entry has been
          // clicked.
          onCommand: new ExtensionCommon.EventManager({
            context,
            module: "Restart",
            event: "onCommand",
            extensionApi: this,
          }).api(),
        },
      }
    }

    onShutdown(isAppShutdown) {
      // This function is called if the extension is disabled or removed, or
      // Thunderbird closes. We usually do not have to do any cleanup, if
      // Thunderbird is shutting down entirely.
      if (isAppShutdown) {
        return;
      }

      // Remove the menu from all open normal windows.
      const { extension } = this;
      for (const window of Services.wm.getEnumerator("mail:3pane")) {
        if (window) {
          let elements = Array.from(
            window.document.querySelectorAll(
              '[data-extension-injected="' + extension.id + '"]'
            )
          );
          for (let element of elements) {
            element.remove();
          }
        }
      }

      // Flush all caches.
      Services.obs.notifyObservers(null, "startupcache-invalidate");
    }
  }

  // Export the API by assigning it to the exports parameter of the anonymous
  // closure function, which is the global this.
  exports.Restart = Restart;

})(this)