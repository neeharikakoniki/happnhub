import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AuthBackground from '../components/AuthBackground';

import { loginWithEmail, getUserRole } from '../services/auth/emailAuth';
import { signInWithGoogle } from '../services/auth/googleAuth';

import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await loginWithEmail(email, password);
      const userRole = await getUserRole(user.uid);

      dispatch(setUser({ uid: user.uid, role: userRole }));
      navigation.replace('Home', { role: userRole }); // Optional if HomeScreen uses route.params
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { role });
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      const userRole = await getUserRole(user.uid);

      dispatch(setUser({ uid: user.uid, role: userRole }));
      Alert.alert('Success', `Welcome ${user.displayName || user.email}`);
      navigation.replace('Home', { role: userRole }); // Optional if HomeScreen uses Redux
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <AuthBackground>
      <View style={styles.content}>
        <Text style={styles.title}>HappnHub</Text>

        <View style={styles.roleSwitch}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.roleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={styles.roleText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={styles.roleText}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#eee"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#eee"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login as {role}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>OR</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '85%',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    letterSpacing: 1,
  },
  roleSwitch: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  roleActive: {
    backgroundColor: '#fff',
  },
  roleText: {
    color: '#333',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    marginTop: 20,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  divider: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dividerText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.6,
  },
});
