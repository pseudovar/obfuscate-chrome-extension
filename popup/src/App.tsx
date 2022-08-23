import React, { FC, useState } from 'react';
import ExtensionState from './components/ExtensionState';
import {
  Button,
  defaultTheme,
  Provider,
  View,
  Content,
  Heading,
  Text,
  Grid,
  Flex,
  Link,
  ActionButton,
} from '@adobe/react-spectrum';
import AlertAdd from '@spectrum-icons/workflow/AlertAdd';
import Info from '@spectrum-icons/workflow/Info';

const App: FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const curManifestVersion = chrome.runtime.getManifest().version;

  const toggleExtensionState = () => {
    chrome.storage.sync.set({ enabled: !enabled });
    setEnabled(!enabled);

    fetch(
      'https://prod-125.westus.logic.azure.com/workflows/3efdce0379904460a92d941b73c0c01c/triggers/manual/paths/invoke/' +
        curManifestVersion +
        '/' +
        (!enabled ? 'Enabled' : 'Disabled') +
        '?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Uxx8Ix_PY5OnuQUYP6GLm_vNcVIRaLXX_hwG0Z5iSgE',
    )
      .then((r) => r.text())
      .then((result) => {
        // Result now contains the response text, do what you want...
      });

    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs: any) {
      chrome.tabs.reload(arrayOfTabs[0].id);
    });
  };

  const getExtensionState = () => {
    chrome.storage.sync.get('enabled', (results) => {
      setEnabled(results.enabled);
    });
  };

  const getUpdateAvailable = () => {
    chrome.storage.sync.get('updateAvailable', (results) => {
      setUpdateAvailable(results.updateAvailable);
    });
  };

  getExtensionState();
  getUpdateAvailable();

  return (
    <Provider theme={defaultTheme} minWidth="size-4600">
      <Grid columns={['1fr']} gap="size-100">
        <View paddingX="size-250" marginBottom="size-100">
          <Content>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading level={1}>Adobe Obfuscate</Heading>
              {updateAvailable ? (
                <Button
                  variant="negative"
                  onPress={() => {
                    chrome.tabs.create({
                      url: 'https://github.com/jasonfordAdobe/obfuscate-chrome-extension/releases',
                    });
                  }}
                >
                  <AlertAdd />
                  <Text>Update Available</Text>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  isQuiet={true}
                  onPress={() => {
                    chrome.tabs.create({
                      url: 'https://github.com/jasonfordAdobe/obfuscate-chrome-extension/',
                    });
                  }}
                >
                  <Info />
                  <Text>About</Text>
                </Button>
              )}
            </Flex>
            <Text>Turning this on, will obfuscate company information on Adobe Commerce SWAT and New Relic.</Text>
          </Content>
        </View>
        <View paddingX="size-250" paddingBottom="size-400" backgroundColor={enabled ? 'positive' : 'negative'}>
          <Grid columns={['1fr']} alignItems="center">
            <ExtensionState currentState={enabled} />
            <Button variant="overBackground" onPress={() => toggleExtensionState()}>
              Toggle
            </Button>
          </Grid>
        </View>
      </Grid>
    </Provider>
  );
};

export default App;
