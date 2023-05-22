chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.sync.get('enabled', ({ enabled }) => {
        if (enabled) {
            if (changeInfo.status === 'complete') {
                chrome.scripting
                    .insertCSS({
                        target: { tabId: tabId },
                        files: ['./obfuscate.css'],
                    })
                    .then(() => {
                        console.log('INJECTED THE FOREGROUND STYLES.')
                    })
                    .catch((err) => {
                        console.log(err)
                        //do nothing
                    })
            }
            chrome.action.setIcon({ path: 'icons/adobe-on-128.png' }, () => {
                console.log('turned on')
            })
        } else {
            chrome.action.setIcon({ path: 'icons/adobe-off-128.png' }, () => {
                console.log('turned off')
            })
        }

        checkExtUpdateAvailable().then((available) => {
            if (available) {
                chrome.action.setBadgeText({ text: '⇪' })
                chrome.action.setBadgeBackgroundColor({ color: '#eb1000' })
                chrome.storage.sync.set({ updateAvailable: true })
            }
        })
    })
})

chrome.webNavigation.onDOMContentLoaded.addListener(() => {
    chrome.storage.sync.get('enabled', ({ enabled }) => {
        if (enabled) {
            console.log('here')
            let target = document.body
            console.log('target', target)
        }
    })
})

chrome.runtime.onInstalled.addListener(() => {
    let enabled = true
    chrome.storage.sync.set({ enabled })
    chrome.storage.sync.set({ updateAvailable: false })
    console.log('Is the plugin enabled? ' + enabled)

    fetch(
        'https://prod-125.westus.logic.azure.com/workflows/3efdce0379904460a92d941b73c0c01c/triggers/manual/paths/invoke/' +
            curManifestVersion +
            '/Installed?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Uxx8Ix_PY5OnuQUYP6GLm_vNcVIRaLXX_hwG0Z5iSgE'
    )
        .then((r) => r.text())
        .then((result) => {
            // Result now contains the response text, do what you want...
        })
    fetch(
        'https://prod-125.westus.logic.azure.com/workflows/3efdce0379904460a92d941b73c0c01c/triggers/manual/paths/invoke/' +
            curManifestVersion +
            '/Enabled?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Uxx8Ix_PY5OnuQUYP6GLm_vNcVIRaLXX_hwG0Z5iSgE'
    )
        .then((r) => r.text())
        .then((result) => {
            // Result now contains the response text, do what you want...
        })
})

async function checkExtUpdateAvailable() {
    // Compare current manifest vs GitHub
    const response = await fetch(
            'https://raw.githubusercontent.com/jasonfordAdobe/obfuscate-chrome-extension/master/build/manifest.json'
        ),
        json = await response.json(),
        remoteManifestParts = json.version.split('.')
    let remoteIsNewer = false
    for (let i = 0; i < remoteManifestParts.length; i++) {
        if (
            parseInt(remoteManifestParts[i], 10) >
            parseInt(curManifestVersion.split('.')[i], 10)
        ) {
            remoteIsNewer = true
            break
        }
    }
    // return remoteIsNewer || true
    return remoteIsNewer
}

const curManifestVersion = chrome.runtime.getManifest().version
