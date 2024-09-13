// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup in the top level scope will
// be registered as a persistent listener and the background will wake up (restart)
// each time the event is fired. Listeners have to be registered before the first
// occurrence of an await keyword.

browser.action.onClicked.addListener(() => {
  browser.SearchDialog.open();
});
