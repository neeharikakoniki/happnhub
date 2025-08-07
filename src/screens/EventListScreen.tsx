import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchEvents } from '../api/eventsApi';
import { EventItem } from '../types/EventItem';
import EventListItem from '../components/EventListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'EventList'>;

export default function EventListScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchEvents('Atlanta', 'GA');
      setEvents(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleEventPress = (event: EventItem) => {
    navigation.navigate('EventDetail', { event, role });
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
      <View style={styles.circleMidLeft} />
      <View style={styles.circleMidRight} />

      <Text style={styles.title}>All Events ({role})</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item)}>
              <EventListItem event={item} onPress={() => navigation.navigate('EventDetail', { event: item, role })} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 240, 240, 0.8)',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
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
});
