browser.windows.onCreated.addListener(listen);

function sleep (delay) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(resolve, delay);
    });
}

 async function listen(aWindow){
   if (aWindow.type == "messageCompose") {
      console.log("Pass1");
      var details = await browser.tabs.query({windowId:aWindow.id});
      console.log("Pass2", details);
      await sleep(100);
      var composeDetails = await browser.compose.getComposeDetails(details[0].id);       
      console.log("Pass3", composeDetails);
    }  
 }