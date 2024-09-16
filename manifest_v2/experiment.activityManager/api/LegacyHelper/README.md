## Objective

This API is a temporary helper while converting legacy extensions to modern WebExtensions. It allows to register `chrome://` and `resource://` urls, which are needed to load custom system modules (*.sys.mjs) and to open legacy XUL dialogs.

## Usage

Add the [LegacyHelper API](https://github.com/thunderbird/webext-support/tree/master/experiments/LegacyHelper) to your add-on. Your `manifest.json` needs an entry like this:

```
  "experiment_apis": {
    "LegacyHelper": {
      "schema": "api/LegacyHelper/schema.json",
      "parent": {
        "scopes": ["addon_parent"],
        "paths": [["LegacyHelper"]],
        "script": "api/LegacyHelper/implementation.js"
      }
    }
  },
```

## API Functions

This API provides the following functions:

### async registerGlobalUrls(data)

Register `chrome://*/content/` and `resource://*/` urls. The function accepts a `data` parameter, which is an array of url definition items. For example:

```
await browser.LegacyHelper.registerGlobalUrls([
  ["content", "myaddon", "legacy/"],
  ["resource", "myaddon", "modules/"],
]);
```

This registers the following urls:
* `chrome://myaddon/content/` pointing to the `/legacy/` folder (the `/content/` part in the url is fix and does not depend on the name of the folder it is pointing to)
* `resource://myaddon/` pointing to the `/modules/` folder. To register a `resource://` url which points to the root folder, use `.` instead".

### async openDialog(name, path)

Open a XUL dialog. The `name` parameter is a unique name identifying the dialog. If the dialog with that name is already open, it will be focused instead of being re-opened. The `path` parameter is a `chrome://*/content/` url pointing to the XUL dialog file (*.xul or *.xhtml).

```
browser.LegacyHelper.openDialog(
  "XulAddonOptions",
  "chrome://myaddon/content/options.xhtml"
);
```
