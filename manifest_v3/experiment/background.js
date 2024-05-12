// Thunderbird can terminate idle backgrounds in Manifest V3.
// Any listener directly added during add-on startup will be registered as a
// persistent listener and the background will wake up (restart) each time the
// event is fired. 

// We defined this event in our schema.
browser.ExampleAPI.onToolbarClick.addListener(async function (x, y) {
  let { clickCounts } = await browser.storage.local.get({clickCounts: 1});

  // We defined this function in our schema.
  // We could do something interesting here with x, and y, but we're not going to.
  browser.ExampleAPI.sayHello(`Hello world! I counted <${clickCounts}> clicks so far.`);
  clickCounts++;
  await browser.storage.local.set({clickCounts});
});
