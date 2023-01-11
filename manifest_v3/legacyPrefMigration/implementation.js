/* eslint-disable object-shorthand */

// Get various parts of the WebExtension framework that we need.
var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");

// You probably already know what this does.
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

// This is the base preference name for all your legacy prefs.
const MY_EXTENSION_BASE_PREF_NAME = "myaddon.";

/**
 * This maps preference names to their types. This is needed as the prefs
 * system doesn't actually know what format you've stored your pref in.
 */
function prefType(name) {
  switch (name) {
    case "bool_pref": {
      return "bool";
    }
    case "integer_pref": {
      return "int";
    }
    case "ascii_string_pref": {
      return "char";
    }
    case "unicode_string_pref": {
      return "string";
    }
  }
  throw new Error(`Unexpected pref type ${name}`);
}


// This is the important part. It implements the functions and events defined in schema.json.
// The variable must have the same name you've been using so far, "migratePrefs" in this case.
var migratePrefs = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      // Again, this key must have the same name.
      migratePrefs: {

        async getPref(name) {
          try {
            switch (prefType(name)) {
              case "bool": {
                return Services.prefs.getBoolPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
              }
              case "int": {
                return Services.prefs.getIntPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
              }
              case "char": {
                return Services.prefs.getCharPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
              }
              case "string": {
                return Services.prefs.getStringPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
              }
            }
          } catch (ex) {
            return undefined;
          }
          throw new Error("Unexpected pref type");
        },

      },
    };
  }
};
