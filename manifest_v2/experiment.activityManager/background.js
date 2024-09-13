// We defined this event in our schema.
browser.ActivityManager.onCommand.addListener(async function (x, y) {
  browser.notifications.create({
    "type": "basic",
    "title": "Restart",
    "message": `The "Clear List" button of the Activity Manager was clicked at (${x},${y}).`
  })
});
