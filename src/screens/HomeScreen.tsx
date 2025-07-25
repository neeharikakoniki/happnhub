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
} from 'react-native';
import MapView, { Marker, Callout, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import EventCard from '../components/EventCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ route }: Props): React.JSX.Element {
  const { role } = route.params;

  const [showFullMap, setShowFullMap] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 👉 now include categories for each event
  const nearbyEvents = [
    {
      id: '1',
      name: 'Trap House Brunch',
      latitude: 33.754472,
      longitude: -84.37248299999999,
      category: 'party',
    },
    {
      id: '2',
      name: 'Art Expo',
      latitude: 33.7555,
      longitude: -84.37,
      category: 'art',
    },
    {
      id: '3',
      name: 'Music Night',
      latitude: 33.7565,
      longitude: -84.374,
      category: 'music',
    },
  ];

  const dummyEvents = [
    {
      id: '1',
      name: 'Trap House Brunch',
      summary: 'ATLANTA\'S #1 SATURDAY DAY PARTY',
      startDate: '2025-07-26',
      startTime: '15:00',
      endTime: '21:00',
      latitude: 33.754472,
      longitude: -84.37248299999999,
      address: '464 Edgewood Avenue Southeast, Atlanta, GA 30312',
      category: 'party',
    },
    {
      id: '2',
      name: 'Art Expo 2025',
      summary: 'Experience the best local art in town!',
      startDate: '2025-07-28',
      startTime: '11:00',
      endTime: '18:00',
      latitude: 33.75,
      longitude: -84.39,
      address: 'Downtown Atlanta, GA',
      category: 'art',
    },
    {
      id: '3',
      name: 'Music Night',
      summary: 'Live performances & fun!',
      startDate: '2025-08-02',
      startTime: '18:00',
      endTime: '22:00',
      latitude: 33.7565,
      longitude: -84.374,
      address: 'Midtown Atlanta, GA',
      category: 'music',
    },
  ];

  useEffect(() => {
    requestLocationPermission();
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

  // ✅ helper to pick icon based on category
  const getIconName = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('music')) return 'music-note';
    if (cat.includes('art')) return 'palette';
    if (cat.includes('party')) return 'celebration';
    if (cat.includes('food')) return 'restaurant';
    return 'event'; // default
  };

  return (
    <View style={styles.rootContainer}>
      {/* Decorative circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => {}}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {showFullMap ? (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.fullMap}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* User marker */}
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
              <Icon name="person-pin-circle" size={40} color="#1976D2" />
            </Marker>

            {/* Event markers with category-based icons */}
            {nearbyEvents.map((evt) => (
              <Marker
                key={evt.id}
                coordinate={{ latitude: evt.latitude, longitude: evt.longitude }}
              >
                <Icon name={getIconName(evt.category)} size={36} color="black" />
                <Callout>
                  <Text>{evt.name}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowFullMap(false)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.greeting}>👋 Welcome!</Text>
            <Text style={styles.userRole}>
              You are logged in as {role === 'admin' ? 'Admin' : 'User'}
            </Text>
          </View>

          {/* Mini Map Preview */}
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

          {/* View All Events Button */}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setShowAllEvents((prev) => !prev)}
          >
            <Text style={styles.viewAllText}>
              {showAllEvents ? 'Hide Events' : 'View All Events'}
            </Text>
          </TouchableOpacity>

          {/* Nearby Events Section */}
          <Text style={styles.sectionTitle}>⭐ Nearby Events</Text>
          {showAllEvents && (
            <FlatList
              data={dummyEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <EventCard event={item} />}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoutBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  userRole: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  miniMap: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  fullMap: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  viewAllButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
});


