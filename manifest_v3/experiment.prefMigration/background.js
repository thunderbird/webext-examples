import * as prefs from "./modules/preferences/preferences.mjs";

// Migrate preferences from extensions.myaddon.* to local storage.
let migrated = await prefs.getPref("_migrated");
if (!migrated) {
  for (let prefName of Object.keys(prefs.DEFAULTS)) {
    let prefValue = await browser.LegacyPrefs.getUserPref(
      `extensions.myaddon.${prefName}`
    );
    if (prefValue === null) {
      continue;
    }
    console.log(`Migrating extensions.myaddon.${prefName}: ${prefValue}`)
    await prefs.setPref(prefName, prefValue);
    await browser.LegacyPrefs.clearUserPref(
      `extensions.myaddon.${prefName}`
    );
  }
  await prefs.setPref("_migrated", true);
}

// Log current prefs.
for (let [prefName, defaultValue] of prefs.getDefaults()) {
  let currentValue = await prefs.getPref(prefName);
  let userValue = await prefs.getUserPref(prefName);
  console.log({
    prefName,
    defaultValue,
    currentValue,
    userValue
  })
}
