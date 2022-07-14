import React, { FC, useState } from 'react';
import ExtensionState from './components/ExtensionState';
import { Button, defaultTheme, Provider, View, Content, Heading, Text, Grid, Flex, Link } from '@adobe/react-spectrum';


const App: FC = () => {

  const [enabled, setEnabled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const toggleExtensionState = () => {
    chrome.storage.sync.set({ enabled: !enabled })
    setEnabled(!enabled);
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs: any) {
      chrome.tabs.reload(arrayOfTabs[0].id);
    });
  }

  const getExtensionState = () => {
    chrome.storage.sync.get('enabled', (results) => {
      setEnabled(results.enabled)
    })
  }

  const getUpdateAvailable = () => {
    chrome.storage.sync.get('updateAvailable', (results) => {
      setUpdateAvailable(results.updateAvailable)
    })
  }

  getExtensionState();
  getUpdateAvailable();

  return <Provider theme={defaultTheme} minWidth="size-4600">
    <Grid columns={['1fr']} gap="size-100">
      <View paddingX="size-250" marginBottom="size-100">
        <Content>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={1}>Adobe Obfuscate</Heading>
            { updateAvailable && <Link><a href="https://github.com/jasonfordAdobe/obfuscate-chrome-extension" target="_blank" rel="noreferrer">Update Available &#128279;</a></Link> }
          </Flex>
          <Text>Turning this on, will obfuscate company information on Adobe Commerce SWAT and New Relic.</Text>
        </Content>
      </View>
      <View paddingX="size-250" paddingBottom="size-400" backgroundColor={(enabled ? "positive" : "negative")}>
        <Grid columns={['1fr']} alignItems="center">
          <ExtensionState currentState={enabled} />
          <Button variant="overBackground" onPress={() => toggleExtensionState()}>
            Toggle
          </Button>
        </Grid>
      </View>
    </Grid>
  </Provider>;
};

export default App;
