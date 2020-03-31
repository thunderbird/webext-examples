/* globals gDBView */
{
  let treecols = document.getElementById("threadCols");
  if (treecols) {
    let splitter = document.createXULElement("splitter");
    splitter.setAttribute("class", "tree-splitter");
    treecols.appendChild(splitter);
    let treecol = document.createXULElement("treecol");
    treecol.setAttribute("id", "colSpamScore");
    treecol.setAttribute("persist", "hidden ordinal width");
    treecol.setAttribute("currentView", "unthreaded");
    treecol.setAttribute("flex", "2");
    treecol.setAttribute("label", "Spam Score");
    treecols.appendChild(treecol);
  }
}

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
Services.obs.addObserver({
  isEditable(row, col) {
    return false;
  },
  getCellText(row) {
    let header = gDBView.getMsgHdrAt(row);
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
    if (window.gDBView) {
      gDBView.addColumnHandler("colSpamScore", this);
    }
  },
}, "MsgCreateDBView");
