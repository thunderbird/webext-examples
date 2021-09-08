## Managed Storage

WebExtensions can allow enterprise IT administrators to override/pre-configure add-on preferences, but the add-on needs to actively look up those values. To get for example the `colour` value of the managed storage, an add-on has to do this:

```
let managed_colour = await messenger.storage.managed.get("colour");
```

Once an add-on supports the managed storage, IT administrators can deploy configuration files as described here:
* https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#managed_storage_manifests
* https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#manifest_location

This add-on can be used to test this concept:

1. Follow the instructions given to deploy the storage file. On Windows, one has to create a registry key for the example add-on, which points to a json file:

![image](https://user-images.githubusercontent.com/5830621/129868105-d08a7968-699f-4f02-892a-74ac8dd8289e.png)

And that file should look like so:

```
{
  "name":  "favourite-colour-examples@mozilla.org",
  "description": "ignored",
  "type": "storage",
  "data": {
    "colour": "management thinks it should be blue!"
  }
}
```

2. Install this add-on.
5. The add-on added browser action button to Thunderbird's main window labled `Managed Storage Example`. Either click that or open the add-ons option page. You should see this:

![image](https://user-images.githubusercontent.com/5830621/129869571-a8f9bead-30b6-4a8a-a0e7-ef080cae0647.png)

It depends on the add-on how the information from the managed storage is used. In this case it is just presented as an information, but it could also lock the config field and enforce the value from the management.