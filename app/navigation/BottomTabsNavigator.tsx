import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Notes from '../features/notes/screens/Notes.tsx';
import Tasks from '../features/tasks/screens/Tasks.tsx';
import { StyleSheet } from 'react-native';
import Icon from '../components/icon/Icon.tsx';
import Colors from '../styles/colors.ts';
import Fonts from '../styles/Fonts.tsx';

type BottomTabsParamList = {
  notes: undefined;
  tasks: undefined;
  settings: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabsParamList>();

const NotesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="sticky-note" size={size} color={color} />
);
const TasksIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="check-square" size={size} color={color} />
);

const BottomTabsNavigator = () => {
  const areaInsets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tabs.Navigator
        screenOptions={{
          animation: 'fade',
          headerShown: false,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
          tabBarActiveTintColor: Colors.textColor,
          tabBarLabelStyle: {
            fontFamily: Fonts.MontserratRegular,
          },
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: 60 + areaInsets.bottom,
            paddingTop: 14,
            backgroundColor: Colors.tabBarBackground,
          },
        }}
      >
        <Tabs.Screen
          name="notes"
          component={Notes}
          options={{
            tabBarIcon: NotesIcon,
            title: 'Notes',
          }}
        />
        <Tabs.Screen
          name="tasks"
          component={Tasks}
          options={{
            tabBarIcon: TasksIcon,
            title: 'Tasks',
          }}
        />
      </Tabs.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default BottomTabsNavigator;
