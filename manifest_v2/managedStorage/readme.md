## Managed Storage

WebExtensions can allow enterprise IT administrators to override/pre-configure extension preferences, but the extension needs to actively look up those values. To get for example the `colour` value of the managed storage, an extension has to do this:

```
let managed_colour = await messenger.storage.managed.get("colour");
```

Once an extension supports the managed storage, IT administrators can deploy a global configuration using enterprise policies. This example extension can be used to test this concept:

1. Follow the instructions given in our [policies repository](https://github.com/thunderbird/policy-templates) to deploy enterprise policies. For example on Windows, create a directory called `distribution` where Thunderbird's EXE file is located and place a `policies.json` file there, with the following content:
```
{
  "policies": {
    "3rdparty": {
      "Extensions": {
        "managed-storage@examples.thunderbird.net": {
          "colour": "management thinks it should blue!"
        }
      }
    }
  }
}
```

2. Install this example extension.
3. The extension is adding a browser action button to Thunderbird's main toolbar, labeled `Managed Storage Example`. Either click that or open the extension's option page. You should see this:

![image](https://user-images.githubusercontent.com/5830621/129869571-a8f9bead-30b6-4a8a-a0e7-ef080cae0647.png)

It depends on the extension how the information from the managed storage is used. In this case it is just shown as an information, but the extension could also lock the config field and enforce the value from the management.