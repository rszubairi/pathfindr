import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CoursesScreen } from '../screens/learning/CoursesScreen';
import { KidProfileListScreen } from '../screens/learning/KidProfileListScreen';
import { ProgressScreen } from '../screens/learning/ProgressScreen';
import { LeaderboardScreen } from '../screens/learning/LeaderboardScreen';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useTranslation } from 'react-i18next';

export type MainTabParamList = {
  Dashboard: undefined;
  Courses: undefined;
  Kids: undefined;
  Progress: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: { backgroundColor: colors.tabBarBg, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'layout';
              break;
            case 'Courses':
              iconName = 'book-open';
              break;
            case 'Kids':
              iconName = 'users';
              break;
            case 'Progress':
              iconName = 'trending-up';
              break;
            case 'Leaderboard':
              iconName = 'award';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Courses" 
        component={CoursesScreen} 
        options={{ title: 'Courses' }}
      />
      <Tab.Screen 
        name="Kids" 
        component={KidProfileListScreen} 
        options={{ title: 'Kids' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen} 
        options={{ title: 'Progress' }} 
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen} 
        options={{ title: 'Ranks' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
