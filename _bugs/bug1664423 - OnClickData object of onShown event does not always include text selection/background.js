
browser.menus.create({
  id: "sender",
  title: "Sender",
  contexts: ["all"],
});

browser.menus.onShown.addListener((info) => {
  console.log(info);
});

browser.menus.onClicked.addListener((info) => {
  console.log(info);
});
