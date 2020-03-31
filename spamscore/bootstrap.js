/* globals APP_SHUTDOWN, Components */
/* exported install, uninstall, startup, shutdown */
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
function install() {
}
function uninstall() {
}
function startup() {
  windowObserver.init();
}
function shutdown(params, reason) {
  if (reason == APP_SHUTDOWN) {
    return;
  }
  windowObserver.destroy();
}

var windowObserver = {
  init() {
    this.enumerate("mail:3pane", this.paint);
    Services.ww.registerNotification(this);
  },
  destroy() {
    Services.ww.unregisterNotification(this);
  },
  enumerate(windowType, callback) {
    let windowEnum = Services.wm.getEnumerator(windowType);
    while (windowEnum.hasMoreElements()) {
      callback.call(this, windowEnum.getNext());
    }
  },
  observe(subject) {
    if (!["chrome://messenger/content/messenger.xul", "about:blank"].includes(subject.location.href)) {
      return;
    }

    windowObserver.paint(subject);
  },
  paint(win) {
    if (win.document.readyState != "complete") {
      win.addEventListener("load", function() {
        windowObserver.paint(win);
      }, { once: true });
      return;
    }

    let script = "chrome://spamscore/content/overlay.js";
    Services.scriptloader.loadSubScript(script, win);
  },
};
