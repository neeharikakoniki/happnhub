// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import { RootStackParamList } from '../navigation/AppNavigator';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../api/eventsApi';
import { EventItem } from '../types/EventItem';
import { COLORS } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ route, navigation }: Props): React.JSX.Element {
  const { role } = route.params;

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    loadEvents();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getUserLocation();
      }
    } else {
      getUserLocation();
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    const data = await fetchEvents('Atlanta', 'GA');
    setEvents(data);
    setLoadingEvents(false);
  };

  const getIconName = (category?: string) => {
    const cat = category?.toLowerCase() ?? '';
    if (cat.includes('music')) return 'music-note';
    if (cat.includes('art')) return 'palette';
    if (cat.includes('party')) return 'celebration';
    if (cat.includes('food')) return 'restaurant';
    return 'event';
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
      <View style={styles.circleMidLeft} />
      <View style={styles.circleMidRight} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          try {
            await auth().signOut();
            navigation.replace('Login');
          } catch (error: any) {
            Alert.alert('Logout Failed', error.message || 'An error occurred while logging out');
          }
        }}
      >
         <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {showFullMap ? (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.fullMap}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
              <Icon name="person-pin-circle" size={40} color="#1976D2" />
            </Marker>

            {events.map((event) => (
              <Marker
                key={event.id}
                coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              >
                <Icon name={getIconName(event.category)} size={36} color="black" />
                <Callout>
                  <Text>{event.name}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity style={styles.backButton} onPress={() => setShowFullMap(false)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome</Text>
            <Text style={styles.userRole}>You are logged in as {role}</Text>
          </View>

          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => navigation.navigate('Favorites', { role })}
          >
            <Text style={styles.favoritesText}>Your Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowFullMap(true)}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.miniMap}
              region={region}
              pointerEvents="none"
            >
              <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                <Icon name="person-pin-circle" size={30} color="#1976D2" />
              </Marker>
            </MapView>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Nearby Events</Text>
          {loadingEvents ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={events.slice(0, 2)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <EventCard event={item} role={role} />}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('EventList', { role })}
          >
            <Text style={styles.viewAllText}>View All Events</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'rgba(203, 157, 157, 0.05)',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    zIndex: 0,
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    zIndex: 0,
  },
  circleMidLeft: {
    position: 'absolute',
    top: 150,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 107, 0.04)',
    zIndex: 0,
  },
  circleMidRight: {
    position: 'absolute',
    top: 300,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 107, 0.06)',
    zIndex: 0,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginTop: 50,
    marginRight: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userRole: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 4,
  },
  miniMap: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  fullMap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  viewAllButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  favoritesButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  favoritesText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },


});
