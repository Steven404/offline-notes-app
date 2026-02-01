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

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './app/navigation/Navigation.tsx';
import { NotesContextProvider } from './app/providers/NotesContext.tsx';
import { KeyboardProvider } from 'react-native-keyboard-controller';

function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <NotesContextProvider>
          <StatusBar barStyle={'light-content'} />
          <Navigation />
        </NotesContextProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default App;
