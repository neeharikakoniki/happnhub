// src/screens/EventDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useFavorites } from './FavoritesContext';
import { rsvpToEvent, cancelRsvp, isUserRsvped } from '../services/events/rsvpService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route }: Props) {
  const { event, role } = route.params;
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
    const eventDate = new Date(event.startDate + 'T' + event.startTime);
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

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(event.id);
      Alert.alert('Removed from favorites');
    } else {
      addFavorite(event);
      Alert.alert('Added to favorites');
    }
    setIsFavorite(!isFavorite);
  };

  const toggleRSVP = async () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>

      {role === 'admin' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminAttendees', { eventId: event.id })}
        >
          <Text style={styles.adminButtonText}>View Attendees</Text>
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
        <Text style={styles.countdown}>{countdown}</Text>
      </View>

      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
        onPress={toggleFavorite}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.rsvpButton, rsvped && styles.rsvpActive]}
        onPress={toggleRSVP}
      >
        <Text style={styles.rsvpText}>
          {rsvped ? 'Cancel RSVP' : 'RSVP to Event'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { eventId: event.id })}
      >
        <Text style={styles.chatButtonText}>Chat with Attendees</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  address: {
    color: '#fff',
    marginBottom: 15,
  },
  summary: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#eee',
    fontWeight: '600',
    marginRight: 8,
  },
  infoValue: {
    color: '#fff',
  },
  countdownContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  countdownLabel: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  countdown: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  favoriteActive: {
    backgroundColor: '#FFA07A',
  },
  favoriteButtonText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 16,
  },
  rsvpButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  rsvpActive: {
    backgroundColor: '#FFD700',
  },
  rsvpText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 16,
  },
  chatButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  adminButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 16,
  },
});
