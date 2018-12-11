let input = document.querySelector("input");
let button = document.querySelector("button");
let accountId = new URL(location.href).searchParams.get("accountId");

browser.storage.local.get([accountId]).then(accountInfo => {
  if ("oauth_token" in accountInfo[accountId]) {
    input.value = accountInfo[accountId].oauth_token;
  }
});

document.querySelector("button").onclick = async () => {
  input.disabled = button.disabled = true;
  let start = Date.now();
  await browser.storage.local.set({ accountId: input.value });
  setTimeout(() => {
    input.disabled = button.disabled = false;
  }, Math.max(0, start + 500 - Date.now()));
};
