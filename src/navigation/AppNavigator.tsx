// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import EventListScreen from '../screens/EventListScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AdminAttendeesScreen from '../screens/AdminAttendeesScreen';
import ChatScreen from '../screens/ChatScreen';

import { EventItem } from '../api/eventsApi'; 
import { FavoritesProvider } from '../screens/FavoritesContext';

export type RootStackParamList = {
  Login: undefined;
  Signup: { role: 'user' | 'admin' };
  Home: { role: 'user' | 'admin' };
  EventList: { role: 'user' | 'admin' };
  EventDetail: { event: EventItem; role: 'admin' | 'user' };
  Favorites: undefined; 
  AdminAttendees: { eventId: string };
  Chat: { eventId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <FavoritesProvider>      
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EventList" component={EventListScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="AdminAttendees" component={AdminAttendeesScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
