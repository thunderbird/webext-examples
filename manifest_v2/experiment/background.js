async function main() {
  //Define the resource url.
  await browser.ResourceUrl.register("exampleapi", "modules/");

  // We defined this event in our schema.
  browser.ExampleAPI.onToolbarClick.addListener(function (toolbar, x, y) {
    // We could do something interesting here with toolbar, x, and y, but we're not going to.
    // We defined this function in our schema.
    browser.ExampleAPI.sayHello("world");
  });
}

main();
