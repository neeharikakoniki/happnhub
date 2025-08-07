import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../../src/screens/LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../src/navigation/AppNavigator';


jest.mock('../../../src/services/auth/emailAuth', () => ({
  loginWithEmail: jest.fn(),
  getUserRole: jest.fn(),
}));

jest.mock('../../../src/services/auth/googleAuth', () => ({
  signInWithGoogle: jest.fn(),
}));

import { loginWithEmail, getUserRole } from '../../../src/services/auth/emailAuth';
import { signInWithGoogle } from '../../../src/services/auth/googleAuth';

describe('LoginScreen', () => {

  const navigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'Login'>;


  const route = {
    key: 'login-key',
    name: 'Login',
  } as RouteProp<RootStackParamList, 'Login'>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in with email/password and navigates to Home with correct role', async () => {
    const mockUser = { uid: 'abc123', email: 'test@example.com' };
    (loginWithEmail as jest.Mock).mockResolvedValue(mockUser);
    (getUserRole as jest.Mock).mockResolvedValue('admin');

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login as user'));

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(getUserRole).toHaveBeenCalledWith('abc123');
      expect(navigation.replace).toHaveBeenCalledWith('Home', { role: 'admin' });
    });
  });

  it('navigates to Signup screen when "Sign Up" link is pressed', () => {
    const { getByText } = render(<LoginScreen navigation={navigation} route={route} />);
    fireEvent.press(getByText("Don't have an account? Sign Up"));
    expect(navigation.navigate).toHaveBeenCalledWith('Signup', { role: 'user' });
  });

  it('signs in with Google and navigates to Home with role', async () => {
    const mockGoogleUser = { uid: 'google123', displayName: 'Google User', email: 'google@example.com' };
    (signInWithGoogle as jest.Mock).mockResolvedValue(mockGoogleUser);
    (getUserRole as jest.Mock).mockResolvedValue('user');

    const { getByText } = render(<LoginScreen navigation={navigation} route={route} />);
    fireEvent.press(getByText('Sign in with Google'));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalled();
      expect(getUserRole).toHaveBeenCalledWith('google123');
      expect(navigation.replace).toHaveBeenCalledWith('Home', { role: 'user' });
    });
  });
});
