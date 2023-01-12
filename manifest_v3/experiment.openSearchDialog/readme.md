## Open Search Dialog Experiment

This contains a WebExtension experiment created with [the Experiment Generator](https://darktrojan.github.io/generator/generator.html).

It was created in response to a developer's question on how to open the search dialog.

### Required changes for manifest v3

The `browser_action` manifest entry had to be changed into an `action` manifest key and all call to
`browser.browserAction.*` had to be replaced by `browser.action.*`.
