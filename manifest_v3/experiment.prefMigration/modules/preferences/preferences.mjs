/*
 * This file is provided by the webext-support repository at
 * https://github.com/thunderbird/webext-support
 *
 * For usage descriptions, please check:
 * https://github.com/thunderbird/webext-support/tree/master/modules/preferences
 *
 * Version 1.1
 *
 */

const DEFAULTS = {
    // Default preference values
    enableDebug: false
}

// Return the current default values as an array of { prefName, defaultValue }
// objects.
export function getDefaults() {
    return Object.entries(DEFAULTS).map(
        e => ({ prefName: e[0], defaultValue: e[1]})
    )
}

// Remove stored preference value.
export async function clearUserPref(name) {
    await browser.storage.local.remove(name);
}

// Return preference value or default value.
export async function getPref(name) {
    let defaultValue = DEFAULTS[name] ?? null;
    let rv = await browser.storage.local.get({ [name]: defaultValue });
    return rv[name];
}

// Ignore default values and return null if preference not set.
export async function getUserPref(name) {
    let rv = await browser.storage.local.get({ [name]: null });
    return rv[name];
}

// Set preference.
export async function setPref(name, value) {
    await browser.storage.local.set({ [name]: value });
}
