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

        checkExtUpdateAvailable().then(available => {
            if (available) {
              chrome.action.setBadgeText({text: '⇪'})
              chrome.action.setBadgeBackgroundColor({color: '#eb1000'})
              chrome.storage.sync.set({ updateAvailable: true })
            }
          })
    });
})

chrome.runtime.onInstalled.addListener(() => {
    let enabled = true;
    chrome.storage.sync.set(
        { enabled }
    );
    chrome.storage.sync.set({ updateAvailable: false })
    console.log("Is the plugin enabled? " + enabled);
});

async function checkExtUpdateAvailable() {
    // Compare current manifest vs GitHub
    const response = await fetch('https://raw.githubusercontent.com/jasonfordAdobe/obfuscate-chrome-extension/master/build/manifest.json'),
      json = await response.json(),
      remoteManifestParts = json.version.split('.')
    let remoteIsNewer = false
    for (let i = 0; i < remoteManifestParts.length; i++) {
      if (parseInt(remoteManifestParts[i], 10) > parseInt(curManifestVersion.split('.')[i], 10)) {
        remoteIsNewer = true
        break
      }
    }
    // return remoteIsNewer || true
    return remoteIsNewer
  }

const curManifestVersion = chrome.runtime.getManifest().version