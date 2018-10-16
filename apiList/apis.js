let mainList = document.querySelector("ul");
displayObject(browser, mainList);
mainList.onclick = function({target}) {
  target = target.closest("li");
  if (target) {
    target.classList.toggle("collapsed");
  }
};

function displayObject(object, list) {
  for (let key of Object.keys(object).sort()) {
    let value;
    try {
      value = object[key];
    } catch (ex) {
      console.error(ex);
    }
    if (!value || !["function", "object"].includes(typeof value)) {
      continue;
    }
    let item = document.createElement("li");
    item.textContent = key;

    if (typeof value == "object") {
      item.classList.add("collapsed");
      let newList = document.createElement("ul");
      item.appendChild(newList);
      displayObject(value, newList);
    }
    list.appendChild(item);
  }
}
