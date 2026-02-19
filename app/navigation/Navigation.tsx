import React, { lazy } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './BottomTabsNavigator.tsx';
const NoteEditor = lazy(
  () => import('../features/notes/screens/NoteEditor.tsx'),
);
const Note = lazy(() => import('../features/notes/screens/Note'));
const Settings = lazy(() => import('../features/settings/screens/Settings.ts'));
const BiometricLogin = lazy(
  () => import('../features/auth/screens/BiometricLogin.tsx'),
);

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
