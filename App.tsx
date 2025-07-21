import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/screens/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <AppNavigator />
    </>
  );
}
