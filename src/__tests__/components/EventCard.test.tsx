import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard from '../../components/EventCard';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

const mockEvent = {
  id: '1',
  name: 'Test Event',
  summary: 'This is a test event.',
  startDate: '2025-08-10',
  startTime: '18:00',
  endTime: '20:00',
  latitude: 0,
  longitude: 0,
  address: '123 Test Street',
};

describe('EventCard', () => {
  it('renders event details and handles press', () => {
    const { getByText } = render(
      <NavigationContainer>
        <EventCard event={mockEvent} role="user" />
      </NavigationContainer>
    );

    expect(getByText('Test Event')).toBeTruthy();
    expect(getByText('18:00 - 20:00')).toBeTruthy();
    expect(getByText('123 Test Street')).toBeTruthy();

    fireEvent.press(getByText('Test Event'));
    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', {
      event: mockEvent,
      role: 'user',
    });
  });
});
