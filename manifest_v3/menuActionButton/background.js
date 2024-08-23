// Wrapper for handling errors during creation of menu items.
async function addMenuEntry(createData) {
  let { promise, resolve, reject } = Promise.withResolvers();
  let id = browser.menus.create(createData, resolve);
  await promise;
  let error = browser.runtime.lastError; // null or Error object
  if (error) {
    console.error("Failed to create menu entry:", { createData, error });
  };
  console.info(`Successfully created menu entry <${id}>`);
  return id;
}

// In Manifest V3 all event listeners must be added before the first await
// statement in the file scope code, otherwise the listeners are not registered
// as event pages and will not wake up the background script once it has been
// terminated.
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "abcd":
      console.log("Clicked menu entry ABCD")
      break;
    case "private":
      console.log("Clicked menu entry PRIVATE")
      break;
    case "org":
      console.log("Clicked menu entry ORG")
      break;
  }
  console.log({tab, info});
})

await addMenuEntry({
  id: "abcd",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Project ABCD"
})
await addMenuEntry({
  id: "private",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Private mail"
});
await addMenuEntry({
  id: "org",
  contexts: ["compose_action_menu"],
  type: "radio",
  title: "Organizational mail"
});

