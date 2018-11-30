browser.mailTabs.getCurrent().then(function(currentTab) {
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
});
