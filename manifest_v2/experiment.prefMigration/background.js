// This is the current "migration" version. You can increase it later
// if you happen to need to do more pref (or maybe other migrations) only once
// for a user.
const kCurrentLegacyMigration = 1;

// This is the list of defaults for the legacy preferences. Note, you only
// need to handle the defaults here. Regardless of if there are preferences
// to be migrated or not, these values will be saved if the preference doesn't
// exist.
const kPrefDefaults = {
  bool_pref: false,
  integer_pref: 23,
  ascii_string_pref: "default",
  unicode_string_pref: "",
};

async function migratePrefs() {
  // You could use any sub-section that you want here, it doesn't have
  // to be called "preferences".
  const results = await browser.storage.local.get("preferences");

  const currentMigration =
    results.preferences && results.preferences.migratedLegacy
      ? results.preferences.migratedLegacy
      : 0;

  if (currentMigration >= kCurrentLegacyMigration) {
    return;
  }

  let prefs = results.preferences || {};

  if (currentMigration < 1) {
    for (const prefName of Object.getOwnPropertyNames(kPrefDefaults)) {
      prefs[prefName] = await browser.myapi.getPref(prefName);
      if (prefs[prefName] === undefined) {
        prefs[prefName] = kPrefDefaults[prefName];
      }
    }
  }

  prefs.migratedLegacy = kCurrentLegacyMigration;
  await browser.storage.local.set({ preferences: prefs });
}

// This is just a debug wrapper so you can see it in action. You could call
// `migratePrefs().catch(console.error);` directly.
async function main() {
  // This triggers the migration.
  await migratePrefs();

  const results = await browser.storage.local.get("preferences");
  console.log({ results });
}

main().catch(console.error);
