import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AuthBackground from '../components/AuthBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ route, navigation }: Props) {
  const { role } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    navigation.replace('Home', { role });
  };

  return (
    <AuthBackground>
      <View style={styles.content}>
        <Text style={styles.title}>HappnHub</Text>
        <Text style={styles.subtitle}>Sign up as {role}</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
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
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
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
