# Sample Extensions

This is a collection of WebExtensions that can be used to test stuff in Thunderbird.

| folder                | description |
|-----------------------|-------------|
| addressBooks          | Uses the `addressbooks`, `contacts`, and `mailingLists` APIs and its dependencies. |
| apiList               | Lists all available APIs in different windows: tabs, options, message compose and message display window. It uses the `tabs` API to [inject scripts](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#executescript-tabid-details) and [css](https://thunderbird-webextensions.readthedocs.io/en/latest/tabs.html#insertcss-tabid-details) into the message compose and message display windows. |
| composeBody           | Uses the `compose` API to access and manipulate the comtent of the message compose window. |
| dropbox               | Uses the `cloudFile` (a.k.a. FileLink) API to upload attachments to dropbox. |
| experiment            | Shows how to write an Experiment API including a function and an event and how to listen to the custom event. |
| filter                | Uses the `mailTabs`, `menus`and `messages` APIs to add a *Filter* context menu to the message list which can set certain quickfilter settings. |
| layout                | Uses the `mailTabs` APIs to manipulate the appearance of the main Thunderbird window.|
| legacyPrefMigration   | |
| messageDisplay        | |
| openSearchDialog      | |
| restart               | |
| sobriety              | |

To use one of the extensions, clone or download this repository and either:

* Zip the directory of your choice (`manifest.json` should be at the top level of the zip file) and install it like any other Add-On in Thunderbird.
* Choose "Debug Add-Ons" from the Add-Ons Manager menu, click "Load Temporary Add-On" and select `manifest.json` from your source (or any other file part of your Add-On). Temporary loaded Add-Ons do not need to be zipped.
