async function main() {
  // We defined this event in our schema.
  browser.ExampleAPI.onToolbarClick.addListener(async function (toolbar, x, y) {
    let { clickCounts } = await browser.storage.local.get({clickCounts: 1});

    // We defined this function in our schema.
    // We could do something interesting here with toolbar, x, and y, but we're not going to.
    browser.ExampleAPI.sayHello(`Hello world! I counted <${clickCounts}> clicks so far.`);
    clickCounts++;
    await browser.storage.local.set({clickCounts});
  });
}

main();
