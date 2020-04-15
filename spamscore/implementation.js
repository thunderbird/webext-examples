var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

function initWindow(window) {
  let document = window.document;
  let treecols = document.getElementById("threadCols");
  if (treecols) {
    let splitter = document.createXULElement("splitter");
    splitter.setAttribute("id", "splitterSpamScore");
    splitter.setAttribute("class", "tree-splitter");
    treecols.appendChild(splitter);
    let treecol = document.createXULElement("treecol");
    treecol.setAttribute("id", "colSpamScore");
    treecol.setAttribute("persist", "hidden ordinal sortDirection width");
    treecol.setAttribute("currentView", "unthreaded");
    treecol.setAttribute("flex", "2");
    treecol.setAttribute("label", "Spam Score");

    let ordinal = Services.xulStore.getValue(window.location.href, "colSpamScore", "ordinal");
    if (ordinal) {
      for (let col of treecols.children) {
        if (col.style.MozBoxOrdinalGroup >= ordinal - 1) {
          col.style.MozBoxOrdinalGroup = parseInt(col.style.MozBoxOrdinalGroup, 10) + 2;
        }
      }
      splitter.style.MozBoxOrdinalGroup = ordinal - 1;
      treecol.style.MozBoxOrdinalGroup = ordinal;
    }
    treecols.appendChild(treecol);
  }

  window._spamColumnHandler = new columnHandler(window);
}

function cleanUpWindow(window) {
  let document = window.document;
  for (let id of ["splitterSpamScore", "colSpamScore"]) {
    let element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  }
  if (window._spamColumnHandler) {
    Services.obs.removeObserver(window._spamColumnHandler, "MsgCreateDBView");
    delete window._spamColumnHandler;
  }
}

function columnHandler(window) {
  this.window = window;
  if (window.gDBView) {
    try {
      window.gDBView.getColumnHandler("colSpamScore");
    } catch (ex) {
      window.gDBView.addColumnHandler("colSpamScore", this);
    }
  }
  Services.obs.addObserver(this, "MsgCreateDBView");
}
columnHandler.prototype = {
  isEditable(row, col) {
    return false;
  },
  getCellText(row) {
    let header = this.window.gDBView.getMsgHdrAt(row);
    let value = this.getSortLongForRow(header) - 1000;
    return (value / 10).toFixed(1);
  },
  getSortStringForRow(header) {
    return this.getSortLongForRow(header) / 10;
  },
  isString() {
    return false;
  },
  getCellProperties() {
  },
  getRowProperties() {
  },
  getImageSrc() {
    return null;
  },
  getSortLongForRow(header) {
    let status = header.getProperty("x-spam-status");
    let score = /score=(-?[0-9]+\.[0-9])/.exec(status);
    if (score) {
      return 1000 + parseFloat(score[1], 10) * 10;
    }
    return 1000;
  },
  observe() {
    if (this.window.gDBView) {
      try {
        this.window.gDBView.getColumnHandler("colSpamScore");
      } catch (ex) {
        this.window.gDBView.addColumnHandler("colSpamScore", this);
      }
    }
  },
};


var spamScore = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    let prefValue = Services.prefs.getStringPref("mailnews.customHeaders");
    if (prefValue) {
      prefValue = prefValue.split(": ");
      if (!prefValue.includes("X-Spam-Status")) {
        prefValue.push("X-Spam-Status");
        Services.prefs.setStringPref("mailnews.customHeaders", prefValue.join(": "));
      }
    } else {
      Services.prefs.setStringPref("mailnews.customHeaders", "X-Spam-Status");
    }

    context.callOnClose(this);
    return {
      spamScore: {
        async init() {
          ExtensionSupport.registerWindowListener("spamScore", {
            // Before Thunderbird 74, messenger.xhtml was messenger.xul.
            chromeURLs: [
              "chrome://messenger/content/messenger.xhtml",
              "chrome://messenger/content/messenger.xul",
            ],
            onLoadWindow(window) {
              initWindow(window);
            },
          });
        },
      },
    };
  }

  close() {
    ExtensionSupport.unregisterWindowListener("spamScore");
    for (let window of Services.wm.getEnumerator("mail:3pane")) {
      cleanUpWindow(window);
    }
  }
};
