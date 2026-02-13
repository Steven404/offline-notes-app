import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './BottomTabsNavigator.tsx';
import NoteEditor from '../features/notes/screens/NoteEditor.tsx';
import Note from '../features/notes/screens/Note.tsx';
import Settings from '../features/settings/screens/Settings.tsx';
import BiometricLogin from '../features/auth/screens/BiometricLogin.tsx';

export type RootStackParamList = {
  bottomTabsNavigator: undefined;
  noteEditor: { noteId?: string };
  note: { noteId: string };
  settings: undefined;
  biometricLogin: { onSuccess: () => void };
};

const RootStack = createStackNavigator<RootStackParamList>();

interface NavigationProps {
  initialRouteName: keyof RootStackParamList;
}

const Navigation = ({ initialRouteName }: NavigationProps) => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={initialRouteName}>
        <RootStack.Screen
          name="biometricLogin"
          component={BiometricLogin}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="bottomTabsNavigator"
          component={BottomTabsNavigator}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="noteEditor"
          component={NoteEditor}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="note"
          component={Note}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="settings"
          component={Settings}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
