// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '785749160318-5qu75ecfbkrf60eje606dhedb091por2.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <AppNavigator />
    </Provider>
  );
}
