import React from 'react';
import { Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { signInWithGoogle } from '../services/auth/googleAuth';
import { getUserRole } from '../services/auth/emailAuth';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function GoogleSignInButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();

      if (!user) {
        Alert.alert('Sign in failed', 'No user returned');
        return;
      }

      const role = await getUserRole(user.uid); 

      Alert.alert('Success', `Welcome ${user.displayName || user.email}`);

      navigation.replace('Home', { role }); 
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google Sign-In failed');
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleSignIn} />;
}
