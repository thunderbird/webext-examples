# Sample Extensions

This is a collection of WebExtensions that can be used to test stuff in Thunderbird.

| Sample Extension               | Description |
|:-------------------------------|:------------|
| addressBooks                   | Uses the `addressbooks`, `contacts`, and `mailingLists` APIs and its dependencies. |
| apiList                        | Lists all available APIs in different windows: tabs, options, message compose and message display window. It uses the `tabs` API to [inject scripts](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#executescript-tabid-details) and [css](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#insertcss-tabid-details) into the message compose and message display windows. |
| awaitPopup                     | Open a blocking popup and await user feedback. |
| composeBody                    | Uses the `compose` API to access and manipulate the content of the message compose window. |
| dropbox                        | Uses the `cloudFile` (a.k.a. FileLink) API to upload attachments to dropbox. |
| experiment                     | Shows how to write an Experiment API including a function and an event and how to listen to the custom event. |
| filter                         | Uses the `mailTabs`, `menus` and `messages` APIs to add a *Filter* context menu to the message list which can set certain quickfilter settings. |
| layout                         | Uses the `mailTabs` APIs to manipulate the appearance of the main Thunderbird window.|
| legacyPrefMigration            | Shows how to migrate preferences from the legacy pref system to the WebExtension local storage. |
| messageDisplay                 | Uses the `messageDisplay` and `messageDisplayAction` APIs to show how to add a button to the message header, and how to react when a message is displayed.|
| messageDisplayScript           | Uses the `messageDisplayScript` API to display a banner with information from the currently selected message along with a button to trigger an action in the background script via `runtime.sendMessage`. |
| messageDisplayScriptPdfPreview | Uses the `listAttachments()` and `getAttachmentFile()` functions of the `messages` API to extract attached PDFs and images, and uses the `messageDisplayScript` API to display an inline preview directly in the message window. |
| openSearchDialog               | Uses an Experiment to open the message search dialog. The Experimnt has been created with [the Experiment Generator](https://darktrojan.github.io/generator/generator.html).|
| restart                        | This extension uses an Experiment to add a *Restart* entry to Thunderbird's *file menu* and a second Experiment to perform the restart. |
| sobriety                       | Shows how the `compose.onBeforeSend` event can be used: Opening a `composeAction` popup in the composition window when an email is about to be send, to request confirmation. |
| theme_experiment               | A theme using the theme_experiment API to change the color of the chat icon. |


To use one of the extensions, clone or download this repository and either:

* Zip the directory of your choice (`manifest.json` should be at the top level of the zip file) and install it like any other Add-On in Thunderbird.
* Choose "Debug Add-Ons" from the Add-Ons Manager menu, click "Load Temporary Add-On" and select `manifest.json` from your source (or any other file part of your Add-On). Temporary loaded Add-Ons do not need to be zipped.
