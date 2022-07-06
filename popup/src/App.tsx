import React, { FC, useState } from 'react';
import ExtensionState from './components/ExtensionState';
import { Button, defaultTheme, Provider, View, Content, Heading, Text, Grid } from '@adobe/react-spectrum';


const App: FC = () => {

  const [enabled, setEnabled] = useState(false);

  const toggleExtensionState = () => {
    console.log("hello");
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

  getExtensionState();

  return <Provider theme={defaultTheme} minWidth="size-4600">
    <Grid columns={['1fr']} gap="size-100">
      <View paddingX="size-250" marginBottom="size-100">
        <Content>
          <Heading level={1}>Adobe Obfuscate</Heading>
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
