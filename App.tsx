/**
 * Sample React Native App
 * https://github.com/facebook/react-native
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

function App() {
  return (
    <SafeAreaProvider>
      <NotesContextProvider>
        <StatusBar barStyle={'light-content'} />
        <Navigation />
      </NotesContextProvider>
    </SafeAreaProvider>
  );
}

export default App;
