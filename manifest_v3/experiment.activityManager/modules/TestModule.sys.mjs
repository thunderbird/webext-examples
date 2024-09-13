export var TestModule = {
    onLoad(window, extension, emitter) {
        // Add our event listener, which emits "activity-manager-clear".
        window._exampleAddOnClickHandler = (e) => {
            emitter.emit("activity-manager-clear", e.clientX, e.clientY);
        }
        window.document.getElementById("clearListButton").addEventListener("click", window._exampleAddOnClickHandler);
    },

    onUnload(window, extension) {
        // Remove our event listener.
        window.document.getElementById("clearListButton").removeEventListener("click", window._exampleAddOnClickHandler);
        delete window._exampleAddOnClickHandler;
    },
}
