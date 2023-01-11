// Thunderbird can terminate idle backgrounds in manifest v3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// Define the resource url. It is currently not possible to distinguish add-on
// enable from background restart. The following command should only be called
// on enable/startup/install, but not on restart. The Experiment will throw an
// error.
browser.ResourceUrl.register("exampleapi", "modules/");

// We defined this event in our schema.
browser.ExampleAPI.onToolbarClick.addListener(function (toolbar, x, y) {
  // We could do something interesting here with toolbar, x, and y, but we're not going to.
  // We defined this function in our schema.
  browser.ExampleAPI.sayHello("world");
});
