import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ScholarshipsScreen } from '../screens/ScholarshipsScreen';
import { InternshipsScreen } from '../screens/InternshipsScreen';
import { BoardingSchoolsScreen } from '../screens/BoardingSchoolsScreen';
import { InternationalSchoolsScreen } from '../screens/InternationalSchoolsScreen';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useTranslation } from 'react-i18next';

export type MainTabParamList = {
  Dashboard: undefined;
  Scholarships: undefined;
  Internships: undefined;
  BoardingSchools: undefined;
  InternationalSchools: undefined;
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
            case 'Scholarships':
              iconName = 'award';
              break;
            case 'Internships':
              iconName = 'briefcase';
              break;
            case 'BoardingSchools':
              iconName = 'book-open';
              break;
            case 'InternationalSchools':
              iconName = 'globe';
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
        options={{ title: t('nav.home') }}
      />
      <Tab.Screen 
        name="Scholarships" 
        component={ScholarshipsScreen} 
        options={{ title: t('nav.scholarships') }}
      />
      <Tab.Screen 
        name="Internships" 
        component={InternshipsScreen} 
        options={{ title: t('nav.internships') }}
      />
      <Tab.Screen 
        name="BoardingSchools" 
        component={BoardingSchoolsScreen} 
        options={{ title: t('nav.boardingschools') }} 
      />
      <Tab.Screen 
        name="InternationalSchools" 
        component={InternationalSchoolsScreen} 
        options={{ title: t('nav.internationalschools') }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: t('nav.profile') }}
      />
    </Tab.Navigator>
  );
}
