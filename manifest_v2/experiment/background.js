async function main() {
  // We defined this event in our schema.
  browser.ExampleAPI.onToolbarClick.addListener(async function (x, y) {
    let { clickCounts } = await browser.storage.local.get({clickCounts: 1});

    // We defined this function in our schema.
    browser.ExampleAPI.sayHello(`Hello world! I counted <${clickCounts}> clicks so far. You clicked at ${x},${y}`);
    clickCounts++;
    await browser.storage.local.set({clickCounts});
  });
}

main();
