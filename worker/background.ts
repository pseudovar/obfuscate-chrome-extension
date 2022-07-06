chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    
    chrome.storage.sync.get("enabled", ({ enabled }) => {

        if(enabled){
            if (changeInfo.status === "complete") {
                console.log("hello");
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ["./obfuscate.css"]
                }).then(() => {
                    console.log("INJECTED THE FOREGROUND STYLES.");
                })
                .catch((err) => {
                    console.log(err)
                    //do nothing
                });
            }
            chrome.action.setIcon({path: "icons/adobe-on-128.png"}, () => { console.log("turned on") });
        } else {
            chrome.action.setIcon({path: "icons/adobe-off-128.png"}, () => { console.log("turned off") });
        }
    });
})

chrome.runtime.onInstalled.addListener(() => {
    let enabled = true;
    chrome.storage.sync.set(
        { enabled }
    );
    console.log("Is the plugin enabled? " + enabled);
});