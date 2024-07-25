export var TestModule = {
    alert: function (name) {
        Services.wm.getMostRecentWindow("mail:3pane").alert(name);
    },
}