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

async function PrefMigration() {
  // You could use any sub-section that you want here, it doesn't have
  // to be called "preferences".
  const { preferences } = await browser.storage.local.get({ preferences: kPrefDefaults });

  const currentMigration = preferences.migratedLegacy
      ? preferences.migratedLegacy
      : 0;

  if (currentMigration >= kCurrentLegacyMigration) {
    return;
  }

  // This is the migration step "1". You can later add additional migration steps.
  if (currentMigration < 1) {
    for (const prefName of Object.getOwnPropertyNames(kPrefDefaults)) {
      let value = await browser.PrefMigration.getPref(prefName);
      if (value !== undefined) {
        preferences[prefName] = value;
      }
    }
  }

  preferences.migratedLegacy = kCurrentLegacyMigration;
  await browser.storage.local.set({ preferences });
}

try {

  // This triggers the migration.
  await PrefMigration();
  const { preferences } = await browser.storage.local.get({ preferences: kPrefDefaults });
  console.log({ preferences });

} catch (ex) {

  console.error(ex);

}
