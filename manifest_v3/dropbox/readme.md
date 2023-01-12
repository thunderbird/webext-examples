## DropBox

This extension uses the `cloudFile` (a.k.a. FileLink) API that first appeared in Thunderbird 64. [Documentation](https://thunderbird-webextensions.readthedocs.io/en/latest/cloudFile.html).

To use this sample extension, you'll need your own DropBox API access token. The easiest way to do this is by creating your own API app. Instructions are included.

Please note that the CloudFile user interface is undergoing some changes, but everything should continue to work.

### Required changes for manifest v3

The upload state is now stored in the extension's local storage, instead of in the
background, so it is available after the background had been terminated.
