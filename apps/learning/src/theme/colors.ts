export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  headerBg: string;
  headerText: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBg: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  placeholderText: string;
  shadow: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  logoTint: string | undefined;
}

export const lightColors: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  card: '#ffffff',
  primary: '#2563eb',
  primaryLight: '#eff6ff',
  text: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  headerBg: '#2563eb',
  headerText: '#ffffff',
  tabBarActive: '#2563eb',
  tabBarInactive: '#94a3b8',
  tabBarBg: '#ffffff',
  inputBg: '#f8fafc',
  inputBorder: '#e2e8f0',
  inputText: '#1e293b',
  placeholderText: '#94a3b8',
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  logoTint: undefined,
};

export const darkColors: ThemeColors = {
  background: '#0f1629',
  surface: '#1a2340',
  card: '#1a2340',
  primary: '#3b82f6',
  primaryLight: '#1e3a5f',
  text: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  border: '#2d3a5c',
  borderLight: '#232d48',
  headerBg: '#1a2340',
  headerText: '#ffffff',
  tabBarActive: '#3b82f6',
  tabBarInactive: '#64748b',
  tabBarBg: '#1a2340',
  inputBg: '#232d48',
  inputBorder: '#2d3a5c',
  inputText: '#ffffff',
  placeholderText: '#64748b',
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  logoTint: '#ffffff',
};
