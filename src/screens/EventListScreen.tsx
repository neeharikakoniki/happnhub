import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../api/eventsApi';
import { EventItem } from '../api/eventsApi';

export default function EventListScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('smyrna'); 
  const [state, setState] = useState<string>('ga'); 

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'HappnHub Location Permission',
            message: 'HappnHub needs access to your location to show nearby events.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          fetchEventsForLocation(city, state);
        }
      } catch (err) {
        console.warn(err);
        fetchEventsForLocation(city, state);
      }
    } else {
      getUserLocation();
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        
        fetchEventsForLocation(city, state);
      },
      (error) => {
        console.warn(error);
        fetchEventsForLocation(city, state);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchEventsForLocation = async (cityName: string, stateCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(cityName, stateCode);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: EventItem }) => <EventCard event={item} />;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#FF6B6B" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <Text style={styles.noEvents}>No events found nearby.</Text>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  noEvents: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#666',
  },
  listContent: {
    paddingVertical: 10,
  },
});
