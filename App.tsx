// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '785749160318-5qu75ecfbkrf60eje606dhedb091por2.apps.googleusercontent.com',
      offlineAccess: true,
    });

    requestUserPermission();
    setupNotificationListeners();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Push notification permission granted.');
      getFcmToken();
    } else {
      console.log('Push notification permission denied.');
      if (Platform.OS === 'ios') {
        Alert.alert('Enable Notifications', 'Go to Settings > Notifications and enable them.');
      }
    }
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      const user = auth().currentUser;
      if (user) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set(
            {
              fcmToken: token,
            },
            { merge: true }
          );
        console.log('✅ FCM token saved to Firestore for user:', user.uid);
      }
    } catch (err) {
      console.error('❌ Failed to get or save FCM token:', err);
    }
  };

  const setupNotificationListeners = () => {
    // Foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'New Notification',
        remoteMessage.notification?.body ?? ''
      );
    });

    // Background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📩 Background notification:', remoteMessage);
    });

    // When app is opened from quit state via notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 App opened from notification:', remoteMessage);
          // Optionally: Navigate to screen or handle data
        }
      });

    return () => {
      unsubscribeForeground();
    };
  };

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <AppNavigator />
    </Provider>
  );
}
