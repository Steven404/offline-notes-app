import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Notes from '../features/notes/screens/Notes.tsx';
import Tasks from '../features/tasks/screens/Tasks.tsx';
import { StyleSheet } from 'react-native';
import Icon from '../components/icon/Icon.tsx';
import Fonts from '../styles/Fonts.tsx';
import { useTheme } from '../providers/ThemeContext.tsx';
import { Theme } from '../styles/themes.ts';
import { useMemo } from 'react';

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
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tabs.Navigator
        screenOptions={{
          // animation: 'shift',
          headerShown: false,
          tabBarInactiveTintColor: theme.placeholder2,
          tabBarActiveTintColor: theme.textColor,
          tabBarLabelStyle: {
            fontFamily: Fonts.MontserratRegular,
          },
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: 60 + areaInsets.bottom,
            paddingTop: 14,
            backgroundColor: theme.tabBarBackground,
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });

export default BottomTabsNavigator;
