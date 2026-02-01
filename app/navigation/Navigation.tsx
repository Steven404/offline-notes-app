import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './BottomTabsNavigator.tsx';
import NoteEditor from '../features/notes/screens/NoteEditor.tsx';

export type RootStackParamList = {
  bottomTabsNavigator: undefined;
  noteEditor: { noteId: string };
};

const RootStack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
