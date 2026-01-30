import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Notes from '../features/notes/screens/Notes.tsx';
import Reminders from '../features/reminders/screens/Reminders.tsx';
import { StyleSheet, View } from 'react-native';
import Icon from '../components/icon/Icon.tsx';
import Colors from '../styles/colors.ts';
import Fonts from '../styles/Fonts.tsx';

type BottomTabsParamList = {
  notes: undefined;
  reminders: undefined;
  menu: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabsParamList>();

const NotesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="sticky-note" size={size} color={color} />
);
const RemindersIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="bell" size={size} color={color} />
);
const MenuTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="bars" size={size} color={color} />
);

const EmptyComponent = () => <View />;

const BottomTabsNavigator = () => {
  const areaInsets = useSafeAreaInsets();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tabs.Navigator
        screenOptions={{
          animation: 'fade',
          headerShown: false,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
          tabBarActiveTintColor: Colors.white,
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
          name="reminders"
          component={Reminders}
          options={{
            tabBarIcon: RemindersIcon,
            title: 'Reminders',
          }}
        />
        <Tabs.Screen
          name="menu"
          component={EmptyComponent}
          options={{
            headerShown: false,
            title: 'Menu',
            tabBarIcon: MenuTabIcon,
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setIsMenuVisible(true);
            },
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
