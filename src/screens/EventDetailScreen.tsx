
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../redux/store';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { rsvpToEvent, cancelRsvp, isUserRsvped } from '../services/events/rsvpService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route }: Props) {
  const { event, role } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const [isFavorite, setIsFavorite] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [rsvped, setRsvped] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === event.id));
  }, [favorites]);

  useEffect(() => {
    const checkRSVP = async () => {
      const status = await isUserRsvped(event.id);
      setRsvped(status);
    };
    checkRSVP();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateCountdown = () => {
    const now = new Date();
    const eventDate = new Date(`${event.startDate}T${event.startTime}`);
    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdown('Event started');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(event.id));
      Alert.alert('Removed from favorites');
    } else {
      dispatch(addFavorite(event));
      Alert.alert('Added to favorites');
    }
    setIsFavorite(!isFavorite);
  };

  const handleRSVP = async () => {
    try {
      if (rsvped) {
        await cancelRsvp(event.id);
        Alert.alert('RSVP cancelled');
      } else {
        await rsvpToEvent(event.id);
        Alert.alert('RSVP confirmed');
      }
      setRsvped(!rsvped);
    } catch (error: any) {
      Alert.alert('RSVP Error', error.message || 'Something went wrong');
    }
  };

  const sharedButtonStyle = [styles.primaryButton];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>

      {role === 'admin' && (
        <TouchableOpacity
          style={sharedButtonStyle}
          onPress={() => navigation.navigate('AdminAttendees', { eventId: event.id })}
        >
          <Text style={styles.buttonText}>View Attendees</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.address}>{event.address}</Text>
      <Text style={styles.summary}>{event.summary}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Start:</Text>
        <Text style={styles.infoValue}>{event.startDate} at {event.startTime}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>End:</Text>
        <Text style={styles.infoValue}>{event.endTime}</Text>
      </View>

      <View style={styles.countdownContainer}>
        <Text style={styles.countdownLabel}>Countdown to event start:</Text>
        <View style={styles.countdownBox}>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      </View>

      <TouchableOpacity style={sharedButtonStyle} onPress={handleFavorite}>
        <Text style={styles.buttonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={sharedButtonStyle} onPress={handleRSVP}>
        <Text style={styles.buttonText}>
          {rsvped ? 'Cancel RSVP' : 'RSVP to Event'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={sharedButtonStyle}
        onPress={() => navigation.navigate('Chat', { eventId: event.id })}
      >
        <Text style={styles.buttonText}>Chat with Attendees</Text>
      </TouchableOpacity>

      {typeof event.event_url === 'string' && (
        <TouchableOpacity
          style={sharedButtonStyle}
          onPress={() => Linking.openURL(event.event_url!)}
        >
          <Text style={styles.buttonText}>Visit Event Page</Text>
        </TouchableOpacity>
      )}

      {typeof event.tickets_url === 'string' && (
        <TouchableOpacity
          style={sharedButtonStyle}
          onPress={() => Linking.openURL(event.tickets_url!)}
        >
          <Text style={styles.buttonText}>Buy Tickets</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fef9f8', 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary, 
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  summary: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  infoValue: {
    color: '#333',
  },
  countdownContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  countdownLabel: {
    color: '#777',
    fontWeight: '600',
    marginBottom: 6,
  },
  countdownBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
  },
  countdown: {
    fontSize: 20,
    color: '#e53935', 
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: COLORS.primary, 
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
});

