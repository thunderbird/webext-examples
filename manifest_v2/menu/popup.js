async function main(){
  const [tab] = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });

  document.addEventListener("contextmenu", (e) => {
    //e.preventDefault();
    console.log(tab.id)
    browser.menus.overrideContext({ context: "tab", tabId: tab.id });
  });
 
}


main();
