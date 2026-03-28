import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ScholarshipsScreen } from '../screens/ScholarshipsScreen';
import { InternshipsScreen } from '../screens/InternshipsScreen';
import { BoardingSchoolsScreen } from '../screens/BoardingSchoolsScreen';
import { InternationalSchoolsScreen } from '../screens/InternationalSchoolsScreen';
import { ScholarshipDetailScreen } from '../screens/ScholarshipDetailScreen';
import { InternshipDetailScreen } from '../screens/InternshipDetailScreen';
import { UniversityDetailScreen } from '../screens/UniversityDetailScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../theme';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Scholarships: undefined;
  ScholarshipDetail: { id: string };
  BoardingSchools: undefined;
  InternationalSchools: undefined;
  UniversityDetail: { id: string };
  Internships: undefined;
  InternshipDetail: { id: string };
  Dashboard: undefined;
  Profile: undefined;
  Subscription: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          <Stack.Screen name="Scholarships" component={ScholarshipsScreen} options={{ title: 'Scholarships' }} />
          <Stack.Screen name="Internships" component={InternshipsScreen} options={{ title: 'Internships' }} />
          <Stack.Screen name="BoardingSchools" component={BoardingSchoolsScreen} options={{ title: 'Boarding Schools' }} />
          <Stack.Screen name="InternationalSchools" component={InternationalSchoolsScreen} options={{ title: 'International Schools' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        </>
      )}
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetailScreen} options={{ title: 'Scholarship Details' }} />
      <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} options={{ title: 'Internship Details' }} />
      <Stack.Screen name="UniversityDetail" component={UniversityDetailScreen} options={{ title: 'School Details' }} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Upgrade' }} />
    </Stack.Navigator>
  );
}
