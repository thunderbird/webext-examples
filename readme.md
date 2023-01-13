# Sample Extensions

This is a collection of WebExtensions to showcase how the available WebExtension APIs can be used in Thunderbird. Each example exists for Manifest V2 and V3. The MV3 compatible versions include comments to highlight the required changes.

| Sample Extension                | Description |
|:--------------------------------|:------------|
| addressBooks                    | Use the `addressbooks`, `contacts`, and `mailingLists` APIs and its dependencies. |
| apiList                         | List all available APIs in different windows: tabs, options, message compose and message display window. It uses the `tabs` API to [inject scripts](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#executescript-tabid-details) and [css](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#insertcss-tabid-details) into the message compose and message display windows. |
| awaitPopup                      | Open a blocking popup and await user feedback. |
| composeBody                     | Use the `compose` API to access and manipulate the content of the message compose window. |
| dropbox                         | Use the `cloudFile` (a.k.a. FileLink) API to upload attachments to dropbox. |
| experiment                      | Show how to write an Experiment API including a function and an event and how to listen to the custom event. |
| experiment.openSearchDialog     | Use an Experiment to open the message search dialog. The Experiment has been created with [the Experiment Generator](https://darktrojan.github.io/generator/generator.html).|
| experiment.prefMigration        | Use an Experiment to migrate preferences from the legacy pref system to the WebExtension local storage. |
| experiment.restart              | Use an Experiment to add a *Restart* entry to Thunderbird's *file menu* and to perform a Thunderbird restart. |
| mailTabs                        | Use the `mailTabs` APIs to manipulate the appearance of the main Thunderbird window.|
| managedStorage                  | Use `storage.managed` to access data defined by enterprise policies.|
| messageDisplay                  | Use the `messageDisplay` and `messageDisplayAction` APIs to show how to add a button to the message header, and how to react when a message is displayed.|
| messageDisplayScript            | Use the `messageDisplayScript` API to display a banner with information from the currently selected message along with a button to trigger an action in the background script via `runtime.sendMessage`. |
| messageDisplayScript.pdfPreview | Use the `listAttachments()` and `getAttachmentFile()` functions of the `messages` API to extract attached PDFs and images, and uses the `messageDisplayScript` API to display an inline preview directly in the message window. |
| optIn                           | Ask the user for extended consent before using the add-on.|
| quickFilter                     | Use the `mailTabs`, `menus` and `messages` APIs to add a *Filter* context menu to the message list which can set certain quickfilter settings. |
| sobriety                        | Shows how the `compose.onBeforeSend` event can be used: Opening a `composeAction` popup in the composition window when an email is about to be send, to request confirmation. |
| theme_experiment                | A theme using the theme_experiment API to change the color of the chat icon. |


To run any of the listed extensions, clone or download this repository and either:

* zip the directory of your choice (`manifest.json` should be at the top level of the zip file) and install it like any other Add-On in Thunderbird.
* select "Debug Add-Ons" from the Add-On Manager menu, click "Load Temporary Add-On" and select `manifest.json` from your source (or any other file part of your Add-On). Temporary loaded Add-Ons do not need to be zipped.
