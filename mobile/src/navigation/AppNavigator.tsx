import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Écrans d'authentification
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import PricingScreen from '../screens/auth/PricingScreen';

// Écrans principaux
import DashboardScreen from '../screens/main/DashboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EventsScreen from '../screens/main/EventsScreen';
import CreditsScreen from '../screens/main/CreditsScreen';

// Composants
import LoadingScreen from '../components/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#319795',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarLabel: 'Événements',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🎯</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Credits"
        component={CreditsScreen}
        options={{
          tabBarLabel: 'Crédits',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💎</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Routes authentifiées
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          // Routes d'authentification
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Pricing" component={PricingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 