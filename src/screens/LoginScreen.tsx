// src/screens/LoginScreen.tsx
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
import { loginWithEmail, getUserRole } from '../services/auth/emailAuth';
import { signInWithGoogle } from '../services/auth/googleAuth';
import { COLORS } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await loginWithEmail(email, password);
      const userRole = await getUserRole(user.uid);
      navigation.replace('Home', { role: userRole });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { role });
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      const role = await getUserRole(user.uid);
      Alert.alert('Success', `Welcome ${user.displayName || user.email}`);
      navigation.replace('Home', { role });
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative Circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      <View style={styles.content}>
        <Text style={styles.title}>HappnHub</Text>

        <View style={styles.roleSwitch}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.roleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    zIndex: 0,
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    zIndex: 0,
  },
  content: {
    width: '85%',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  roleSwitch: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  roleActive: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  roleText: {
    color: '#fff',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    color: COLORS.textPrimary,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    marginTop: 20,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  divider: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dividerText: {
    color: COLORS.primary,
    fontSize: 14,
    opacity: 0.8,
  },
});

