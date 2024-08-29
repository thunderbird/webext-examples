# WebExtension Examples

This is a collection of WebExtensions for Thunderbird to showcase how the available WebExtension APIs can be used. Each example exists for Manifest V2 and V3. The Manifest V3 compatible versions include comments to highlight the required changes.

Manifest V3 is officially supported since Thunderbird 128. Running Manifest V3 add-ons in older versions of Thunderbird is not recommended.

| Sample Extension                | Description |
|:--------------------------------|:------------|
| addressBooks                    | Uses the `addressbooks`, `contacts`, and `mailingLists` APIs and its dependencies. |
| apiList                         | Lists all available APIs in different windows: tabs, options, message compose and message display window. It uses the `tabs` API to [inject scripts](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#executescript-tabid-details) and [css](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#insertcss-tabid-details) into the message compose and message display windows. |
| awaitPopup                      | Opens a blocking popup and await user feedback. |
| composeBody                     | Uses the `compose` API to access and manipulate the content of the message compose window. |
| composeScript                   | Uses the `composeScript` API to access and manipulate the content of the message compose window. |
| dropbox                         | Uses the `cloudFile` (a.k.a. FileLink) API to upload attachments to dropbox. |
| experiment                      | Shows how to write an Experiment API including a function and an event and how to listen to the custom event. |
| experiment.openSearchDialog     | Uses an Experiment to open the message search dialog. The Experiment has been created with [the Experiment Generator](https://darktrojan.github.io/generator/generator.html).|
| experiment.prefMigration        | Uses an Experiment to migrate preferences from the legacy pref system to the WebExtension local storage. |
| experiment.restart              | Uses an Experiment to add a *Restart* entry to Thunderbird's *file menu* and to perform a Thunderbird restart. |
| mailTabs                        | Uses the `mailTabs` APIs to manipulate the appearance of the main Thunderbird window.|
| managedStorage                  | Uses `storage.managed` to access data defined by enterprise policies.|
| menu                            | Use the menus API to add entries to different menus and shows how to override the context menu of content pages (in popups or tabs).|
| menuActionButton                | Shows how to use menu typed action buttons (a compose action button in this case).|
| messageDisplay                  | Uses the `messageDisplay` and `messageDisplayAction` APIs to show how to add a button to the message header, and how to react when a message is displayed.|
| messageDisplayScript            | Uses the `messageDisplayScript` API to display a banner with information from the currently selected message along with a button to trigger an action in the background script via `runtime.sendMessage`. |
| messageDisplayScript.pdfPreview | Uses the `listAttachments()` and `getAttachmentFile()` functions of the `messages` API to extract attached PDFs and images, and uses the `messageDisplayScript` API to display an inline preview directly in the message window. |
| optIn                           | Asks the user for extended consent before using the add-on.|
| quickFilter                     | Uses the `mailTabs`, `menus` and `messages` APIs to add a *Filter* context menu to the message list which can set certain quickfilter settings. |
| sobriety                        | Shows how the `compose.onBeforeSend` event can be used: Opening a `composeAction` popup in the composition window when an email is about to be send, to request confirmation. |
| theme_experiment                | A theme using the theme_experiment API to change the color of the chat icon. |


To run any of the listed extensions, clone or download this repository and either:

* zip the directory of your choice (`manifest.json` should be at the top level of the zip file) and install it like any other Add-On in Thunderbird.
* select "Debug Add-Ons" from the Add-On Manager menu, click "Load Temporary Add-On" and select `manifest.json` from your source (or any other file part of your Add-On). Temporary loaded Add-Ons do not need to be zipped.

## Hello World tutorial

The `hello-world` folder contains the full sources of our ["Hello World" Extension Tutorial](https://developer.thunderbird.net/add-ons/hello-world-add-on).