var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.sync.get('enabled', function (_a) {
        var enabled = _a.enabled;
        if (enabled) {
            if (changeInfo.status === 'complete') {
                chrome.scripting
                    .insertCSS({
                    target: { tabId: tabId },
                    files: ['./obfuscate.css']
                })
                    .then(function () {
                    console.log('INJECTED THE FOREGROUND STYLES.');
                })["catch"](function (err) {
                    console.log(err);
                    //do nothing
                });
            }
            chrome.action.setIcon({ path: 'icons/adobe-on-128.png' }, function () {
                console.log('turned on');
            });
        }
        else {
            chrome.action.setIcon({ path: 'icons/adobe-off-128.png' }, function () {
                console.log('turned off');
            });
        }
        checkExtUpdateAvailable().then(function (available) {
            if (available) {
                chrome.action.setBadgeText({ text: '⇪' });
                chrome.action.setBadgeBackgroundColor({ color: '#eb1000' });
                chrome.storage.sync.set({ updateAvailable: true });
            }
        });
    });
});
chrome.runtime.onInstalled.addListener(function () {
    var enabled = true;
    chrome.storage.sync.set({ enabled: enabled });
    chrome.storage.sync.set({ updateAvailable: false });
    console.log('Is the plugin enabled? ' + enabled);
    fetch('https://prod-125.westus.logic.azure.com/workflows/3efdce0379904460a92d941b73c0c01c/triggers/manual/paths/invoke/' +
        curManifestVersion +
        '/Installed?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Uxx8Ix_PY5OnuQUYP6GLm_vNcVIRaLXX_hwG0Z5iSgE')
        .then(function (r) { return r.text(); })
        .then(function (result) {
        // Result now contains the response text, do what you want...
    });
    fetch('https://prod-125.westus.logic.azure.com/workflows/3efdce0379904460a92d941b73c0c01c/triggers/manual/paths/invoke/' +
        curManifestVersion +
        '/Enabled?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Uxx8Ix_PY5OnuQUYP6GLm_vNcVIRaLXX_hwG0Z5iSgE')
        .then(function (r) { return r.text(); })
        .then(function (result) {
        // Result now contains the response text, do what you want...
    });
});
function checkExtUpdateAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var response, json, remoteManifestParts, remoteIsNewer, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://raw.githubusercontent.com/jasonfordAdobe/obfuscate-chrome-extension/master/build/manifest.json')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent(), remoteManifestParts = json.version.split('.');
                    remoteIsNewer = false;
                    for (i = 0; i < remoteManifestParts.length; i++) {
                        if (parseInt(remoteManifestParts[i], 10) >
                            parseInt(curManifestVersion.split('.')[i], 10)) {
                            remoteIsNewer = true;
                            break;
                        }
                    }
                    // return remoteIsNewer || true
                    return [2 /*return*/, remoteIsNewer];
            }
        });
    });
}
var curManifestVersion = chrome.runtime.getManifest().version;
