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
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import EventCard from '../components/EventCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ route, navigation }: Props): React.JSX.Element {
  const { role } = route.params;

  const [showMap, setShowMap] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Dummy events preview
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
    },
  ];

  useEffect(() => {
    if (showMap) {
      requestLocationPermission();
    }
  }, [showMap]);

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

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.rootContainer}>
      {/* Decorative circles in background */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {showMap ? (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="You are here"
              description="Your live location"
            />
          </MapView>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>👋 Welcome!</Text>
            <Text style={styles.userRole}>
              You are logged in as {role === 'admin' ? 'Admin' : 'User'}
            </Text>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
              onPress={() => setShowMap(true)}
            >
              <Text style={styles.actionText}>🗺 Show Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#2196F3' }]}
              onPress={() => navigation.navigate('EventList')}
            >
              <Text style={styles.actionText}>📋 View Events</Text>
            </TouchableOpacity>
          </View>

          {/* Preview of events */}
          <Text style={styles.sectionTitle}>⭐ Nearby Events</Text>
          <FlatList
            data={dummyEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EventCard event={item} />}
            scrollEnabled={false}
          />
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
  // Decorative circles
  circleTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
    zIndex: 0,
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 0,
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
    fontSize: 14,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 30,
    zIndex: 2,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

