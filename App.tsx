/**
 * Offline Notes app
 * https://github.com/Steven404/offline-notes-app
 *
 * @format
 */

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fab, far, fas);

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Navigation, {
  RootStackParamList,
} from './app/navigation/Navigation.tsx';
import { NotesContextProvider } from './app/providers/NotesContext.tsx';
import { ThemeContextProvider } from './app/providers/ThemeContext.tsx';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { getDataFromStorage } from './app/utils/asyncStorage.ts';
import SimpleLoading from './app/components/simpleLoading/SimpleLoading.tsx';
import { TasksContextProvider } from './app/providers/TasksContext.tsx';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<
    keyof RootStackParamList | ''
  >('');

  useEffect(() => {
    const checkBiometrics = async () => {
      const enabled = await getDataFromStorage('biometrics_enabled');
      if (enabled === 'true') {
        setInitialRouteName('biometricLogin');
      } else {
        setInitialRouteName('bottomTabsNavigator');
      }
      setIsAppReady(true);
    };

    checkBiometrics();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <StatusBar barStyle={'light-content'} />
            {isAppReady && initialRouteName ? (
              <ThemeContextProvider>
                <NotesContextProvider>
                  <TasksContextProvider>
                    <Navigation initialRouteName={initialRouteName} />
                  </TasksContextProvider>
                </NotesContextProvider>
              </ThemeContextProvider>
            ) : (
              <View style={styles.container}>
                <SimpleLoading />
              </View>
            )}
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
