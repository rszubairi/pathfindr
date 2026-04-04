import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../theme';

// Auth screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Main app screens
import { MainTabNavigator } from './MainTabNavigator';

// Learning screens
import { CourseDetailScreen } from '../screens/learning/CourseDetailScreen';
import { CoursePlayerScreen } from '../screens/learning/CoursePlayerScreen';
import { AssessmentScreen } from '../screens/learning/AssessmentScreen';
import { KidProfileSetupScreen } from '../screens/learning/KidProfileSetupScreen';
import { KidProfileSelectScreen } from '../screens/learning/KidProfileSelectScreen';

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;

  // Main app (authenticated)
  Main: undefined;

  // Learning screens (modal/stack)
  CourseDetail: { courseId: string; autoEnroll?: boolean };
  CoursePlayer: { courseId: string; enrollmentId: string; kidProfileId: string; lessonIndex?: number };
  Assessment: { assessmentId: string; courseId: string; enrollmentId: string; kidProfileId: string };
  KidProfileSetup: { kidId?: string };
  KidProfileSelect: { courseId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Main' : 'Login'}
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Sign In', headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Create Account', headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{ title: 'Course Details' }}
          />
          <Stack.Screen
            name="CoursePlayer"
            component={CoursePlayerScreen}
            options={{ title: 'Learning', headerShown: false }}
          />
          <Stack.Screen
            name="Assessment"
            component={AssessmentScreen}
            options={{ title: 'Assessment', headerShown: false }}
          />
          <Stack.Screen
            name="KidProfileSetup"
            component={KidProfileSetupScreen}
            options={{ title: 'Kid Profile', presentation: 'modal' }}
          />
          <Stack.Screen
            name="KidProfileSelect"
            component={KidProfileSelectScreen}
            options={{ title: 'Select Profile' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}