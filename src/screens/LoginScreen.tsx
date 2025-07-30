import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AuthBackground from '../components/AuthBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('Home', { role });
  };

  const handleSignup = () => {
    navigation.navigate('Signup', { role });
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
});
