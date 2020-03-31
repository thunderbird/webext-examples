async function main() {
  // Get the current visible mailTab

  // browser.mailTabs.query() returns a Promise and one could use
  // the .then() syntax to execute commands after the Promise has
  // been fulfilled. Another option is to use async functions which
  // allow to "await" the Promise. One could say the execution flow
  // of this function halts until the Promise is fulfilled.
  // As the await keyword only works inside async function, the
  // entire code must wrapped.
  let tabs = await browser.mailTabs.query({active: true, currentWindow: true});

  document.getElementById("controls").hidden = (tabs.length == 0);
  document.getElementById("error").hidden = (tabs.length > 0);

  if (tabs.length > 0) {
    let currentTab = tabs[0];
    for (let key of ["standard", "wide", "vertical"]) {
      let label = document.getElementById(key);
      let input = label.querySelector("input");
      input.checked = currentTab.layout == key;
      input.onchange = async () => {
        browser.mailTabs.update({ layout: key });
      };
      label.appendChild(document.createTextNode(" " + browser.i18n.getMessage(key)));
    }

    for (let key of ["folderPaneVisible", "messagePaneVisible"]) {
      let label = document.getElementById(key);
      let input = label.querySelector("input");
      input.checked = currentTab[key];
      input.onchange = async () => {
        browser.mailTabs.update({ [key]: input.checked });
      };
      label.appendChild(document.createTextNode(" " + browser.i18n.getMessage(key)));
    }
  } else {
  }
}

main();
