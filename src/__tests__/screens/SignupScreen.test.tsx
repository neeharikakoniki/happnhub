import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../../../src/screens/SignupScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../src/navigation/AppNavigator';


jest.mock('../../../src/services/auth/emailAuth', () => ({
  signUpWithEmail: jest.fn(),
}));


import { signUpWithEmail } from '../../../src/services/auth/emailAuth';

describe('SignupScreen', () => {
  
  const navigation = {
    replace: jest.fn(),
    goBack: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'Signup'>;

  const route = {
    key: 'signup-key',
    name: 'Signup',
    params: { role: 'user' },
  } as RouteProp<RootStackParamList, 'Signup'>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates account and navigates to Home', async () => {
    (signUpWithEmail as jest.Mock).mockResolvedValue({ uid: 'abc' });

    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={navigation} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledWith('user@example.com', 'password123', 'user');
      expect(navigation.replace).toHaveBeenCalledWith('Home', { role: 'user' });
    });
  });

  it('navigates back to Login screen on link click', () => {
    const { getByText } = render(
      <SignupScreen navigation={navigation} route={route} />
    );

    fireEvent.press(getByText('Already have an account? Log In'));
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
