## Menu typed action buttons

This extension uses a menu typed compose action button, available since Thunderbird 115. It generates
a native menu when the action button is clicked.

![A menu typed compose action button](resources/menu.png)

To define an action button as a menu button, set its `type` to `menu`:

```json
  "compose_action": {
    "default_title": "MenuActionButton",
    "type": "menu"
  },
```

The entries itself are added through the menus API.

### Differences from the version for Manifest V2

In Manifest V3 all event listeners must be added at the top level file scope and before the first await (in case the background script is declared as a module and can use `await` in file scope code). Otherwise the listeners are not registered as event pages and will not wake up the background script once it has been terminated.