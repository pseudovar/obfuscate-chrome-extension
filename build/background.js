chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.sync.get("enabled", function (_a) {
        var enabled = _a.enabled;
        if (enabled) {
            if (changeInfo.status === "complete") {
                console.log("hello");
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ["./obfuscate.css"]
                }).then(function () {
                    console.log("INJECTED THE FOREGROUND STYLES.");
                })["catch"](function (err) {
                    console.log(err);
                    //do nothing
                });
            }
            chrome.action.setIcon({ path: "icons/adobe-on-128.png" }, function () { console.log("turned on"); });
        }
        else {
            chrome.action.setIcon({ path: "icons/adobe-off-128.png" }, function () { console.log("turned off"); });
        }
    });
});
chrome.runtime.onInstalled.addListener(function () {
    var enabled = true;
    chrome.storage.sync.set({ enabled: enabled });
    console.log("Is the plugin enabled? " + enabled);
});
