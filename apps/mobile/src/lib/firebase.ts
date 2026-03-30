import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export const firebaseAnalytics = analytics;
export const firebaseCrashlytics = crashlytics;

export async function logEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  await analytics().logEvent(eventName, params);
}

export async function setUserId(userId: string | null) {
  await analytics().setUserId(userId);
  if (userId) {
    await crashlytics().setUserId(userId);
  }
}

export async function setUserProperty(name: string, value: string) {
  await analytics().setUserProperty(name, value);
}

export function recordError(error: Error, context?: string) {
  if (context) {
    crashlytics().log(context);
  }
  crashlytics().recordError(error);
}

export function log(message: string) {
  crashlytics().log(message);
}
