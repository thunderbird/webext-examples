## Menu typed action buttons

This extension uses a menu typed compose action button, available since Thunderbird 115. It generates
a native menu when the action button is clicked.

![A menu typed compose action button](resources/menu.png)

To define an action button as a menu button, set its `type` to `menu`:

```
  "compose_action": {
    "default_title": "MenuActionButton",
    "type": "menu"
  },
```

The entries itself are added through the menus API.
